import { BranchList } from './branch-lists';

export interface ScannerRecordList {
    id: number;
    branch_list_id?: number;
    branch_list: BranchList;
    office_type: 'branch' | 'ho';
    serial_number: string;
    model: string;
    status: 'Active' | 'Deffective' | 'For Repair';
    remarks: string;
}
