import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BranchList } from '@/types/branch-lists';
import { ScannerRecordList } from '@/types/scanner-record-lists';
import { useForm } from '@inertiajs/react';
import { Loader2, Pen, Save, Trash2, X } from 'lucide-react';
import { Activity, ChangeEvent, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { TableCell, TableRow } from './ui/table';

export default function ScannerRecordLists({
    scannerRecordList,
    selectableBranchLists,
    editingId,
    setEditingId,
}: {
    scannerRecordList: ScannerRecordList;
    selectableBranchLists: BranchList[];
    editingId: number | null;
    setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
}) {
    const {
        patch,
        data,
        setData,
        processing: updating,
        reset,
    } = useForm({
        office_type: '',
        branch_list_id: '',
        serial_number: '',
        model: '',
        status: '',
        remarks: '',
    });
    const { delete: destroy, processing: deleting } = useForm({});

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

    const isEditing = editingId === scannerRecordList?.id;

    const statusClass = (status: 'Active' | 'Deffective' | 'For Repair') => {
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
    };

    const handleInputChange = (field: keyof typeof data) => (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setData((item) => ({
            ...item,
            [field]: value,
        }));
    };

    const handleUpdate = (id: number) => () => {
        patch(route('scanner-record-lists.update', id), {
            onSuccess: () => {
                reset();
                setEditingId(null);
                setEditingId(null);
            },
        });
    };

    const handleEdit = (id: number) => () => {
        setEditingId((prev) => (prev === id ? null : id));
    };

    return (
        <TableRow>
            <TableCell className="font-medium">{scannerRecordList?.id}</TableCell>

            <TableCell>
                {isEditing ? (
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
                ) : (
                    scannerRecordList?.office_type
                )}
            </TableCell>

            <TableCell>{scannerRecordList?.branch_list?.branch_code}</TableCell>

            <TableCell>
                {isEditing ? (
                    <Select value={data.branch_list_id} onValueChange={handleSubmitChange('branch_list_id')}>
                        <SelectTrigger className="w-50">
                            <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Branches</SelectLabel>
                                {selectableBranchLists.length > 0 ? (
                                    selectableBranchLists.map((item, index) => (
                                        <SelectItem key={index} value={String(item.id)}>
                                            {`(${item.branch_code}) - ${item.branch_name}`}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="No branch available" disabled>
                                        No branches available
                                    </SelectItem>
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                ) : (
                    scannerRecordList?.branch_list?.branch_name
                )}
            </TableCell>

            <TableCell>
                {isEditing ? (
                    <Input value={data.serial_number} placeholder="Enter scanner serial number" onChange={handleInputChange('serial_number')} />
                ) : (
                    scannerRecordList?.serial_number
                )}
            </TableCell>

            <TableCell>
                {isEditing ? (
                    <Input value={data.model} placeholder="Enter scanner model" onChange={handleInputChange('model')} />
                ) : (
                    scannerRecordList?.model
                )}
            </TableCell>

            <TableCell>
                {isEditing ? (
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
                ) : (
                    scannerRecordList?.status && (
                        <span className={`rounded-4xl px-1 py-0.5 text-[9px] font-bold uppercase ${statusClass(scannerRecordList?.status)}`}>
                            {scannerRecordList?.status}
                        </span>
                    )
                )}
            </TableCell>

            <TableCell>
                {isEditing ? (
                    <Input value={data.remarks} placeholder="Enter remarks" onChange={handleInputChange('remarks')} />
                ) : (
                    scannerRecordList?.remarks
                )}
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <Activity mode={isEditing ? 'visible' : 'hidden'}>
                        <Button
                            disabled={updating}
                            variant={'outline'}
                            className="text-green-500 hover:text-green-600"
                            type="button"
                            onClick={handleUpdate(scannerRecordList?.id ?? 0)}
                        >
                            {updating ? <Loader2 className="animate-spin" /> : <Save />}
                        </Button>
                    </Activity>

                    <Activity mode={!updating ? 'visible' : 'hidden'}>
                        <Button
                            variant={'outline'}
                            className={`${isEditing ? 'text-red-500 hover:text-red-600' : 'text-blue-500 hover:text-blue-600'}`}
                            type="button"
                            onClick={handleEdit(scannerRecordList?.id ?? 0)}
                        >
                            {isEditing ? <X /> : <Pen />}
                        </Button>
                    </Activity>

                    <Button
                        type="button"
                        variant={'outline'}
                        disabled={deleting}
                        onClick={() => destroy(route('scanner-record-lists.destroy', scannerRecordList?.id))}
                        className="flex items-center gap-1 rounded px-2 py-1 text-sm text-red-500 hover:text-red-600"
                    >
                        {deleting ? <Loader2 className="animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}
