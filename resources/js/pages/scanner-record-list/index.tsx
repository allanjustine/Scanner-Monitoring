import { BranchList } from '@/components/branch-lists';
import ScannerRecordLists from '@/components/scanner-record-lists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster } from '@/components/ui/sonner';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SharedData } from '@/types';
import { BranchList as BranchListTypes } from '@/types/branch-lists';
import { ScannerRecordList } from '@/types/scanner-record-lists';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Loader2, Plus, Save, Search } from 'lucide-react';
import { Activity, ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function Index({
    scannerRecordLists,
    branchLists,
    selectableBranchLists,
}: {
    scannerRecordLists: Record<string, ScannerRecordList[]>;
    branchLists: BranchListTypes[];
    selectableBranchLists: BranchListTypes[];
}) {
    const { flash } = usePage<SharedData>().props;
    const {
        data,
        setData,
        post,
        reset: reset,
        isDirty,
        processing,
    } = useForm({
        office_type: '',
        branch_list_id: '',
        serial_number: '',
        model: '',
        status: '',
        remarks: '',
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const debounceRef = useRef<NodeJS.Timeout>(null);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        search: '',
        per_page: '5',
        page: '',
    });

    useEffect(() => {
        if (isFiltered) {
            router.get(route('scanner-record-lists.index'), filters, {
                preserveState: true,
                replace: true,
            });
            setIsFiltered(false);
        }
    }, [filters, isFiltered]);

    useEffect(() => {
        if (flash.success) {
            toast.success('Success', { description: flash.success, duration: 5000, position: 'bottom-center' });
        }
        if (flash.error) {
            toast.error('Error', { description: flash.error, duration: 5000, position: 'bottom-center' });
        }
    }, [flash]);

    async function submitData() {
        post(route('scanner-record-lists.store'), { onSuccess: () => reset() });
    }

    const handleSelectChange = (field: keyof typeof data) => (value: string) => {
        setData((item) => ({ ...item, [field]: value }));
    };

    const handleInputChange = (field: keyof typeof data) => (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData((item) => ({ ...item, [field]: value }));
    };

    const handlePerPage = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        setFilters((item) => ({
            ...item,
            per_page: value,
        }));
        setIsFiltered(true);
    };

    const handleSearchTerm = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            setFilters((item) => ({
                ...item,
                search: value,
                page: '',
            }));
            setIsFiltered(true);
        }, 1000);
    };

    const handlePageChange = (url: string) => () => {
        const page = new URL(url).searchParams.get('page') || '';

        setFilters((item) => ({
            ...item,
            page,
        }));
        setIsFiltered(true);
    };

    return (
        <>
            <Head title="Scanner Records" />
            <div className="grid min-h-screen grid-cols-[20%_80%] bg-slate-50 dark:bg-[#242526]">
                <BranchList branchLists={branchLists} />
                <div className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-[#242526] dark:to-[#2a2b2c]">
                    <div className="space-y-6 p-8">
                        {/* Header Section */}
                        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#242526]">
                            <div className="flex items-center justify-between gap-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Scanner Records</h1>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage and track all your scanner devices</p>
                                </div>
                                <div className="max-w-md flex-1">
                                    <div className="relative">
                                        <InputGroup className="overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-600">
                                            <InputGroupInput
                                                placeholder="Search by serial number, model..."
                                                onChange={handleSearchTerm}
                                                className="px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-[#333333] dark:text-white dark:placeholder-slate-400"
                                            />
                                            <InputGroupAddon className="border-l border-slate-200 bg-slate-100 px-3 dark:border-slate-600 dark:bg-[#333333]">
                                                <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <Activity mode={filters.search ? 'visible' : 'hidden'}>
                                            <div className="absolute top-1.5 right-1 rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                                                {scannerRecordLists.data.length} result{scannerRecordLists.data.length !== 1 ? 's' : ''}
                                            </div>
                                        </Activity>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#242526]">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableCaption className="py-4 text-sm text-slate-500 dark:text-slate-400">
                                        {scannerRecordLists.data.length > 0
                                            ? `Showing ${scannerRecordLists.data.length} of your scanner records`
                                            : 'Add records to your scanner list to see them here'}
                                    </TableCaption>
                                    <TableHeader className="border-b border-slate-200 bg-linear-to-r from-slate-50 to-slate-100 dark:border-slate-700 dark:from-[#242526] dark:to-[#2a2b2c]">
                                        <TableRow className="py-5 transition-colors hover:bg-slate-100 dark:hover:bg-[#333333]">
                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">ID</TableHead>
                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Office Type</TableHead>
                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Branch Code</TableHead>
                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Branch Name</TableHead>
                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Serial Number</TableHead>
                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Model</TableHead>
                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Remarks</TableHead>
                                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* Add New Record Row */}
                                        <TableRow className="border-b-2 border-blue-200 bg-linear-to-r from-blue-50 to-blue-50 transition-colors hover:from-blue-100 hover:to-blue-100 dark:border-blue-900 dark:from-blue-950/30 dark:to-blue-950/30 dark:hover:from-blue-900/50 dark:hover:to-blue-900/50">
                                            <TableCell className="py-4">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                                                    <Plus className="h-4 w-4" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Select value={data.office_type} onValueChange={handleSelectChange('office_type')}>
                                                    <SelectTrigger className="h-10 w-48 border-slate-300 shadow-sm focus:ring-blue-500">
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
                                            </TableCell>
                                            <TableCell className="py-4 font-medium text-slate-600 dark:text-slate-300">
                                                {selectableBranchLists.find((item) => item.id === Number(data.branch_list_id))?.branch_code || '-'}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Select value={data.branch_list_id} onValueChange={handleSelectChange('branch_list_id')}>
                                                    <SelectTrigger className="h-10 w-48 border-slate-300 shadow-sm focus:ring-blue-500">
                                                        <SelectValue placeholder="Select branch" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Branches</SelectLabel>
                                                            {selectableBranchLists.length > 0 ? (
                                                                selectableBranchLists.map((item) => (
                                                                    <SelectItem key={item.id} value={String(item.id)}>
                                                                        {`(${item.branch_code}) - ${item.branch_name}`}
                                                                    </SelectItem>
                                                                ))
                                                            ) : (
                                                                <SelectItem value="No branches found" disabled>
                                                                    No branches found
                                                                </SelectItem>
                                                            )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Input
                                                    value={data.serial_number}
                                                    placeholder="Enter serial number"
                                                    onChange={handleInputChange('serial_number')}
                                                    className="h-10 border-slate-300 shadow-sm focus:ring-blue-500 dark:border-slate-600 dark:bg-[#333333] dark:text-white dark:placeholder-slate-400"
                                                />
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Input
                                                    value={data.model}
                                                    placeholder="Enter model"
                                                    onChange={handleInputChange('model')}
                                                    className="h-10 border-slate-300 shadow-sm focus:ring-blue-500 dark:border-slate-600 dark:bg-[#333333] dark:text-white dark:placeholder-slate-400"
                                                />
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Select value={data.status} onValueChange={handleSelectChange('status')}>
                                                    <SelectTrigger className="h-10 w-40 border-slate-300 shadow-sm focus:ring-blue-500">
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
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Input
                                                    value={data.remarks}
                                                    placeholder="Enter remarks"
                                                    onChange={handleInputChange('remarks')}
                                                    className="h-10 border-slate-300 shadow-sm focus:ring-blue-500 dark:border-slate-600 dark:bg-[#333333] dark:text-white dark:placeholder-slate-400"
                                                />
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {isDirty ? (
                                                    <Button
                                                        disabled={processing}
                                                        type="button"
                                                        onClick={submitData}
                                                        className="h-10 bg-linear-to-r from-blue-600 to-blue-700 px-4 text-white shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-blue-800"
                                                    >
                                                        {processing ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Save className="mr-2 h-4 w-4" />
                                                                <span>Add</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                        </TableRow>

                                        {/* Existing Records */}
                                        {scannerRecordLists.data.length > 0 ? (
                                            scannerRecordLists.data.map((scannerRecordList, index) => (
                                                <ScannerRecordLists
                                                    key={index}
                                                    scannerRecordList={scannerRecordList}
                                                    selectableBranchLists={selectableBranchLists}
                                                    editingId={editingId}
                                                    setEditingId={setEditingId}
                                                />
                                            ))
                                        ) : (
                                            <TableRow className="transition-colors hover:bg-slate-50 dark:hover:bg-[#333333]">
                                                <TableCell className="py-12 text-center" colSpan={9}>
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-[#333333]">
                                                            <Search className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                                                        </div>
                                                        <p className="font-medium text-slate-600 dark:text-slate-300">No scanner records added yet</p>
                                                        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                                                            Start by adding your first scanner record above
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#242526]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Items per page:</span>
                                    <NativeSelect
                                        value={String(scannerRecordLists.per_page)}
                                        onChange={handlePerPage}
                                        className="h-10 border-slate-300 shadow-sm focus:ring-blue-500 dark:border-slate-600 dark:bg-[#333333] dark:text-white"
                                    >
                                        {[5, 10, 20, 50, 100, 200, 500].map((item, index) => (
                                            <NativeSelectOption value={String(item)} key={index}>
                                                {item} items
                                            </NativeSelectOption>
                                        ))}
                                    </NativeSelect>
                                </div>
                                <Pagination>
                                    <PaginationContent className="gap-2">
                                        <PaginationItem>
                                            <Button
                                                variant="outline"
                                                type="button"
                                                onClick={handlePageChange(String(scannerRecordLists?.prev_page_url))}
                                                disabled={!scannerRecordLists?.prev_page_url}
                                                className={`h-10 border-slate-300 px-4 transition-all dark:border-slate-600 ${
                                                    !scannerRecordLists?.prev_page_url
                                                        ? 'cursor-not-allowed opacity-50'
                                                        : 'hover:border-slate-400 hover:bg-slate-100 dark:hover:border-slate-500 dark:hover:bg-[#333333]'
                                                }`}
                                            >
                                                Previous
                                            </Button>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <Button
                                                variant="outline"
                                                type="button"
                                                onClick={handlePageChange(String(scannerRecordLists?.next_page_url))}
                                                disabled={!scannerRecordLists?.next_page_url}
                                                className={`h-10 border-slate-300 px-4 transition-all dark:border-slate-600 ${
                                                    !scannerRecordLists?.next_page_url
                                                        ? 'cursor-not-allowed opacity-50'
                                                        : 'hover:border-slate-400 hover:bg-slate-100 dark:hover:border-slate-500 dark:hover:bg-[#333333]'
                                                }`}
                                            >
                                                Next
                                            </Button>
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </>
    );
}
