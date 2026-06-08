// lib/db.js
// Database utility for fetching scan results
// Update this based on your actual database setup

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Get the latest scan for a project
 * @param {string} projectId - The project ID
 * @returns {Promise<Object>} Latest scan with findings
 */
export async function getLatestScan(projectId) {
  try {
    // Fetch the latest scan for the project
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (scanError) {
      console.error('Error fetching scan:', scanError);
      return null;
    }

    if (!scan) {
      return null;
    }

    // Fetch findings for this scan
    const { data: findings, error: findingsError } = await supabase
      .from('findings')
      .select('*')
      .eq('scan_id', scan.id);

    if (findingsError) {
      console.error('Error fetching findings:', findingsError);
      return null;
    }

    return {
      id: scan.id,
      projectId: scan.project_id,
      createdAt: scan.created_at,
      findings: findings || [],
    };
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

/**
 * Optional: Get a scan by ID
 * @param {string} scanId - The scan ID
 * @returns {Promise<Object>} Scan with findings
 */
export async function getScan(scanId) {
  try {
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .select('*')
      .eq('id', scanId)
      .single();

    if (scanError) return null;

    const { data: findings } = await supabase
      .from('findings')
      .select('*')
      .eq('scan_id', scanId);

    return {
      id: scan.id,
      projectId: scan.project_id,
      createdAt: scan.created_at,
      findings: findings || [],
    };
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}
