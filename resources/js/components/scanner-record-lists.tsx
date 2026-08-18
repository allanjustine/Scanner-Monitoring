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
    }, [scannerRecordList, setData, editingId]);

    const isEditing = editingId === scannerRecordList?.id;

    const statusClass = (status: 'Active' | 'Deffective' | 'For Repair') => {
        switch (status) {
            case 'For Repair':
                return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
            case 'Active':
                return 'bg-blue-200 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
            case 'Deffective':
                return 'bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-300';
            default:
                return 'bg-indigo-200 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300';
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

    const branchItems = [scannerRecordList.branch_list, ...selectableBranchLists];

    return (
        <TableRow className="border-b border-slate-200 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-[#242526]">
            <TableCell className="py-4 font-semibold text-slate-700 dark:text-slate-300">{scannerRecordList?.id}</TableCell>

            <TableCell className="py-4">
                {isEditing ? (
                    <Select value={data.office_type} onValueChange={handleSubmitChange('office_type')}>
                        <SelectTrigger className="h-10 w-48 border-slate-300 shadow-sm focus:ring-blue-500 dark:border-slate-600 dark:bg-[#242526] dark:text-white">
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
                    <span className="font-medium text-slate-500">{scannerRecordList?.office_type}</span>
                )}
            </TableCell>

            <TableCell className="py-4 font-medium text-slate-400">{scannerRecordList?.branch_list?.branch_code}</TableCell>

            <TableCell className="py-4">
                {isEditing ? (
                    <Select value={data.branch_list_id} onValueChange={handleSubmitChange('branch_list_id')}>
                        <SelectTrigger className="h-10 w-48 border-slate-300 shadow-sm focus:ring-blue-500 dark:border-slate-600 dark:bg-[#242526] dark:text-white">
                            <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Branches</SelectLabel>
                                {branchItems.length > 0 ? (
                                    branchItems.map((item, index) => (
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
                    <span className="text-slate-700 dark:text-slate-300">{scannerRecordList?.branch_list?.branch_name}</span>
                )}
            </TableCell>

            <TableCell className="py-4">
                {isEditing ? (
                    <Input
                        value={data.serial_number}
                        placeholder="Enter serial number"
                        onChange={handleInputChange('serial_number')}
                        className="h-10 border-slate-300 shadow-sm focus:ring-blue-500 dark:border-slate-600 dark:bg-[#242526] dark:text-white dark:placeholder-slate-400"
                    />
                ) : (
                    <span className="font-medium text-slate-700 dark:text-slate-300">{scannerRecordList?.serial_number || '-'}</span>
                )}
            </TableCell>

            <TableCell className="py-4">
                {isEditing ? (
                    <Input
                        value={data.model}
                        placeholder="Enter model"
                        onChange={handleInputChange('model')}
                        className="h-10 border-slate-300 shadow-sm focus:ring-blue-500 dark:border-slate-600 dark:bg-[#242526] dark:text-white dark:placeholder-slate-400"
                    />
                ) : (
                    <span className="text-slate-700 dark:text-slate-300">{scannerRecordList?.model || '-'}</span>
                )}
            </TableCell>

            <TableCell className="py-4">
                {isEditing ? (
                    <Select value={data.status} onValueChange={handleSubmitChange('status')}>
                        <SelectTrigger className="h-10 w-40 border-slate-300 shadow-sm focus:ring-blue-500 dark:border-slate-600 dark:bg-[#242526] dark:text-white">
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
                        <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass(scannerRecordList?.status)}`}
                        >
                            {scannerRecordList?.status}
                        </span>
                    )
                )}
            </TableCell>

            <TableCell className="py-4">
                {isEditing ? (
                    <Input
                        value={data.remarks}
                        placeholder="Enter remarks"
                        onChange={handleInputChange('remarks')}
                        className="h-10 border-slate-300 shadow-sm focus:ring-blue-500 dark:border-slate-600 dark:bg-[#242526] dark:text-white dark:placeholder-slate-400"
                    />
                ) : (
                    <span className="text-sm text-slate-600 dark:text-slate-400">{scannerRecordList?.remarks || '-'}</span>
                )}
            </TableCell>

            <TableCell className="py-4">
                <div className="flex items-center gap-2">
                    <Activity mode={isEditing ? 'visible' : 'hidden'}>
                        <Button
                            disabled={updating}
                            variant="outline"
                            className="h-9 border-green-300 bg-green-50 px-3 text-green-700 transition-all hover:border-green-400 hover:bg-green-100 dark:border-green-900 dark:bg-green-900/30 dark:text-green-400 dark:hover:border-green-700 dark:hover:bg-green-900/50"
                            type="button"
                            onClick={handleUpdate(scannerRecordList?.id ?? 0)}
                        >
                            {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        </Button>
                    </Activity>

                    <Activity mode={!updating ? 'visible' : 'hidden'}>
                        <Button
                            variant="outline"
                            className={`h-9 px-3 transition-all ${
                                isEditing
                                    ? 'border-red-300 bg-red-50 text-red-700 hover:border-red-400 hover:bg-red-100'
                                    : 'border-blue-300 bg-blue-50 text-blue-700 hover:border-blue-400 hover:bg-blue-100'
                            }`}
                            type="button"
                            onClick={handleEdit(scannerRecordList?.id ?? 0)}
                        >
                            {isEditing ? <X className="h-4 w-4" /> : <Pen className="h-4 w-4" />}
                        </Button>
                    </Activity>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={deleting}
                        onClick={() => destroy(route('scanner-record-lists.destroy', scannerRecordList?.id))}
                        className="h-9 border-red-300 bg-red-50 px-3 text-red-700 transition-all hover:border-red-400 hover:bg-red-100"
                    >
                        {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}
