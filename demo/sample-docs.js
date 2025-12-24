/**
 * Sample documents for testing the RAG demo
 * Copy/paste these into the upload form to test the system
 */

export const SAMPLE_DOCS = [
  {
    name: 'Company Policies',
    content: `# Acme Corp Employee Handbook

## Remote Work Policy
Employees may work remotely up to 3 days per week with manager approval. Remote work requires:
- Reliable internet connection (minimum 25 Mbps)
- Dedicated workspace free from distractions
- Availability during core hours (10 AM - 3 PM local time)
- Use of company VPN for all work-related activities

## Expense Reimbursement
The company reimburses the following expenses:
- Travel: Economy class flights, standard hotel rooms (up to $200/night)
- Meals: Up to $75/day when traveling
- Home office equipment: Up to $500 one-time setup allowance
- Professional development: Up to $2,000/year for courses and conferences

Submit all expense reports within 30 days of the expense date. Include receipts for amounts over $25.

## Time Off Policy
- PTO: 20 days per year (accrued monthly)
- Sick leave: 10 days per year
- Holidays: 10 company holidays
- Parental leave: 16 weeks paid (birth/adoption)

## Performance Reviews
Performance reviews occur twice yearly:
- Mid-year check-in (June): Informal progress discussion
- Annual review (December): Formal evaluation and compensation review

Goals are set using the OKR framework. Employees should have 3-5 objectives with 2-4 key results each.`
  },
  {
    name: 'Product Documentation',
    content: `# CloudSync API Documentation

## Overview
CloudSync is a real-time file synchronization service. This API allows developers to integrate file sync capabilities into their applications.

## Authentication
All API requests require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

API keys can be generated in the Developer Console. Keys have the following scopes:
- read: Read file metadata and contents
- write: Upload and modify files
- delete: Delete files and folders
- admin: Manage team members and settings

## Endpoints

### List Files
GET /api/v1/files
Returns a paginated list of files in the user's account.

Query parameters:
- folder_id: Filter by parent folder (optional)
- limit: Results per page (default: 50, max: 200)
- cursor: Pagination cursor from previous response

### Upload File
POST /api/v1/files/upload
Upload a new file or update an existing one.

Request body (multipart/form-data):
- file: The file binary data
- folder_id: Parent folder ID (optional)
- overwrite: Boolean to overwrite existing (default: false)

Maximum file size: 5GB
Supported formats: All file types accepted

### Get File
GET /api/v1/files/:id
Retrieve file metadata and download URL.

### Delete File
DELETE /api/v1/files/:id
Permanently delete a file. This action cannot be undone.

## Rate Limits
- Free tier: 100 requests/minute
- Pro tier: 1,000 requests/minute
- Enterprise: Custom limits

## Error Codes
- 400: Bad request (invalid parameters)
- 401: Unauthorized (invalid or missing API key)
- 403: Forbidden (insufficient permissions)
- 404: Not found
- 429: Rate limit exceeded
- 500: Internal server error`
  },
  {
    name: 'Technical Spec',
    content: `# Database Migration Plan: PostgreSQL to ScyllaDB

## Executive Summary
This document outlines the migration strategy for transitioning our primary data store from PostgreSQL 14 to ScyllaDB, a distributed NoSQL database optimized for high-throughput workloads.

## Current State
- PostgreSQL 14 running on AWS RDS (db.r6g.2xlarge)
- 2.3 TB of data across 47 tables
- Peak load: 15,000 queries/second
- Average query latency: 12ms

## Target Architecture
- ScyllaDB cluster: 6 nodes (i3.2xlarge)
- Replication factor: 3
- Consistency level: LOCAL_QUORUM for writes, LOCAL_ONE for reads
- Expected throughput: 100,000+ operations/second
- Target latency: < 5ms p99

## Migration Phases

### Phase 1: Schema Design (2 weeks)
- Map relational schema to ScyllaDB data model
- Design partition keys for even data distribution
- Create materialized views for query patterns
- Document access patterns and query requirements

### Phase 2: Dual-Write Setup (1 week)
- Implement change data capture (CDC) from PostgreSQL
- Set up Kafka pipeline for real-time replication
- Deploy ScyllaDB cluster in staging environment
- Begin writing to both databases simultaneously

### Phase 3: Historical Data Migration (3 weeks)
- Export historical data in batches (1 million rows/batch)
- Transform and load into ScyllaDB using Spark
- Validate data integrity with checksums
- Performance test with production-like load

### Phase 4: Cutover (1 week)
- Route read traffic to ScyllaDB (10% -> 50% -> 100%)
- Monitor latency and error rates
- Maintain PostgreSQL as hot standby for 2 weeks
- Decommission PostgreSQL after validation period

## Risk Mitigation
- Rollback plan: Revert traffic to PostgreSQL within 5 minutes
- Data validation: Hourly consistency checks during dual-write
- On-call support: Database team available 24/7 during cutover

## Success Criteria
- Zero data loss
- < 5ms p99 latency
- 99.99% availability during migration
- Cost reduction of 40% (projected)`
  }
];
