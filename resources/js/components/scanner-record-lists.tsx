import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BranchList } from '@/types/branch-lists';
import { ScannerRecordList } from '@/types/scanner-record-lists';
import { useForm } from '@inertiajs/react';
import { Loader2, Trash2 } from 'lucide-react';
import { ChangeEvent, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { TableCell, TableRow } from './ui/table';

export default function ScannerRecordLists({
    scannerRecordList,
    selectableBranchLists,
}: {
    scannerRecordList: ScannerRecordList;
    selectableBranchLists: BranchList[];
}) {
    const {
        delete: destroy,
        patch,
        data,
        setData,
        processing,
    } = useForm({
        office_type: '',
        branch_list_id: '',
        serial_number: '',
        model: '',
        status: '',
        remarks: '',
    });
    const debounceRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        setData((data) => ({
            ...data,
            office_type: scannerRecordList?.office_type ?? '',
            branch_list_id: String(scannerRecordList?.branch_list_id ?? ''),
            serial_number: scannerRecordList?.serial_number ?? '',
            model: scannerRecordList?.model ?? '',
            status: scannerRecordList?.status ?? '',
            remarks: scannerRecordList?.remarks ?? '',
        }));
    }, [scannerRecordList, setData]);

    const status = (status: 'Active' | 'Deffective' | 'For Repair') => {
        switch (status) {
            case 'For Repair':
                return 'bg-yellow-200 text-yellow-800';
            case 'Active':
                return 'bg-blue-200 text-blue-800';
            case 'Deffective':
                return 'bg-red-200 text-red-800';
            default:
                return 'bg-indigo-200 text-indigo-800';
        }
    };

    const handleSubmitChange = (field: keyof typeof data) => (value: string) => {
        setData((data) => ({
            ...data,
            [field]: value,
        }));

        patch(route('scanner-record-lists.update', scannerRecordList.id));
    };

    const handleInputChange = (field: keyof typeof data) => (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setData((item) => ({
            ...item,
            [field]: value,
        }));

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            if (!value.trim()) return;

            patch(route('scanner-record-lists.update', scannerRecordList.id));
        }, 1000);
    };

    return (
        <TableRow>
            <TableCell className="font-medium">{scannerRecordList?.id}</TableCell>
            <TableCell>
                {scannerRecordList?.office_type ?? (
                    <Select value={data.office_type} onValueChange={handleSubmitChange('office_type')}>
                        <SelectTrigger className="w-50">
                            <SelectValue placeholder="Select office type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Office type</SelectLabel>
                                {['BRANCH', 'HEAD OFFICE', 'LOGISTIC'].map((item, index) => (
                                    <SelectItem key={index} value={String(item)}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            </TableCell>
            <TableCell>{scannerRecordList?.branch_list?.branch_code}</TableCell>
            <TableCell>
                {scannerRecordList?.branch_list?.branch_name ?? (
                    <Select value={data.branch_list_id} onValueChange={handleSubmitChange('branch_list_id')}>
                        <SelectTrigger className="w-50">
                            <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Branches</SelectLabel>
                                {selectableBranchLists?.map((item, index) => (
                                    <SelectItem key={index} value={String(item.id)}>
                                        {`(${item.branch_code}) - ${item.branch_name}`}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            </TableCell>
            <TableCell>
                {scannerRecordList?.serial_number ?? (
                    <Input value={data.serial_number} placeholder="Enter scanner serial number" onChange={handleInputChange('serial_number')} />
                )}
            </TableCell>
            <TableCell>
                {scannerRecordList?.model ?? <Input value={data.model} placeholder="Enter scanner model" onChange={handleInputChange('model')} />}
            </TableCell>
            <TableCell>
                {scannerRecordList?.status ? (
                    <span className={`rounded-4xl px-1 py-0.5 text-[9px] font-bold uppercase ${status(scannerRecordList?.status)}`}>
                        {scannerRecordList?.status}
                    </span>
                ) : (
                    <Select value={data.status} onValueChange={handleSubmitChange('status')}>
                        <SelectTrigger className="w-50">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                {['Active', 'Deffective', 'For Repair'].map((item, index) => (
                                    <SelectItem key={index} value={String(item)}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            </TableCell>
            <TableCell>
                {scannerRecordList?.remarks ?? <Input value={data.remarks} placeholder="Enter remarks" onChange={handleInputChange('remarks')} />}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant={'outline'}
                        disabled={processing}
                        onClick={() => destroy(route('scanner-record-lists.destroy', scannerRecordList?.id))}
                        className="flex items-center gap-1 rounded px-2 py-1 text-sm text-red-500 hover:text-red-600"
                    >
                        {processing ? <Loader2 className="animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}
