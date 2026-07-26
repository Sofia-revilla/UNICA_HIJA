import { Controller, Get, Post, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { RedisService } from '../common/redis.service';
import { Roles, RolesGuard } from '../auth/roles.guard';

// Simulated DB model representing standard PostgreSQL Client for demonstration
// Prisma client would be injected via construction: constructor(private prisma: PrismaService) {}
const simulatedPrismaPatientClient = {
  findMany: async () => [
    { id: 'WAH-2026-00001', name: 'James Smith', age: 45, status: 'STABLE', department: 'Internal Medicine', mewsScore: 3 },
    { id: 'WAH-2026-00002', name: 'Mary Johnson', age: 62, status: 'CRITICAL', department: 'ICU', mewsScore: 7 }
  ],
  findOne: async (id: string) => {
    return {
      id,
      name: 'James Smith',
      age: 45,
      gender: 'Male',
      status: 'STABLE',
      mewsScore: 3,
      department: 'Internal Medicine',
      roomNumber: 'Room 301-B',
      // Hybrid unstructured JSONB clinical metadata stored directly in Supabase/PostgreSQL
      clinicalData: {
        vitalsHistory: [
          { stamp: '2026-05-19T06:00:00Z', bp: '120/80', hr: 72, temp: 36.8, rr: 16 },
          { stamp: '2026-05-20T04:00:00Z', bp: '118/76', hr: 70, temp: 36.6, rr: 14 }
        ],
        pastHistory: ['Type-2 Diabetes', 'Hypertension'],
        allergies: ['Penicillin']
      }
    };
  }
};

@Controller('patients')
@UseGuards(RolesGuard)
export class PatientsController {
  constructor(private readonly redis: RedisService) {}

  @Get()
  @Roles('DOCTOR', 'NURSE')
  async getAllPatients() {
    // 1. Check Cache first to speed up processing
    const cached = await this.redis.get<any[]>('patients:all');
    if (cached) {
      console.log('Redis Cache HIT - Returning compiled patient records directory.');
      return { source: 'redis-cache', length: cached.length, data: cached };
    }

    // 2. Database Fallback (PostgreSQL query)
    const records = await simulatedPrismaPatientClient.findMany();
    
    // 3. Populate Redis Cache with 60s TTL
    await this.redis.set('patients:all', records, 60);
    console.log('Redis Cache MISS - Queried PostgreSQL + Saved active session cache.');
    
    return { source: 'supabase-postgresql', length: records.length, data: records };
  }

  @Get(':id/clinical-data')
  @Roles('DOCTOR') // Restricted access - strict Doctor-level RBAC
  async getClinicalDetails(@Param('id') id: string) {
    const cacheKey = `patient:clinical:${id}`;
    
    // 1. Attempt High-Speed Redis read
    const cachedObj = await this.redis.get<any>(cacheKey);
    if (cachedObj) {
      console.log(`Redis Cache HIT [${cacheKey}] - Decrypted patient data from memory.`);
      return { status: 'Success', source: 'redis-cache', payload: cachedObj };
    }

    // 2. Standard database fetch with JSONB details
    const patientObj = await simulatedPrismaPatientClient.findOne(id);
    if (!patientObj) {
      throw new HttpException('Patient records not active in local directory', HttpStatus.NOT_FOUND);
    }

    // 3. Dynamic parse of unstructured clinicalData column (PostgreSQL JSONB validation)
    const rawClinicalData = patientObj.clinicalData;
    console.log('SQL Database JSONB Unpacking:', JSON.stringify(rawClinicalData));

    // 4. Save to Redis Session
    await this.redis.set(cacheKey, patientObj, 120); // 2 min time cache
    console.log(`Redis cache populated for [${cacheKey}] with 120s TTL.`);

    return { status: 'Success', source: 'supabase-postgresql-jsonb', payload: patientObj };
  }
}
