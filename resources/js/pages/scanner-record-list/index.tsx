import { BranchList } from '@/components/branch-lists';
import ScannerRecordLists from '@/components/scanner-record-lists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
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
        cursor: '',
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
                cursor: '',
            }));
            setIsFiltered(true);
        }, 1000);
    };

    const handlePageChange = (cursor: string) => () => {
        setFilters((item) => ({
            ...item,
            cursor,
        }));
        setIsFiltered(true);
    };

    return (
        <>
            <Head title="Home" />
            <div className="grid grid-cols-[20%_80%]">
                <BranchList branchLists={branchLists} />
                <div className="p-10">
                    <div className="flex justify-between">
                        <h1 className="text-lg">Scanner records</h1>
                        <div>
                            <InputGroup>
                                <InputGroupInput placeholder="Search..." onChange={handleSearchTerm} />
                                <InputGroupAddon>
                                    <Search />
                                </InputGroupAddon>
                                <Activity mode={filters.search ? 'visible' : 'hidden'}>
                                    <InputGroupAddon align="inline-end">{scannerRecordLists.data.length} results</InputGroupAddon>
                                </Activity>
                            </InputGroup>
                        </div>
                    </div>
                    <Table>
                        <TableCaption>A list of your recent scanner records.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-25">ID</TableHead>
                                <TableHead>Office Type</TableHead>
                                <TableHead>Branch Code</TableHead>
                                <TableHead>Branch Name</TableHead>
                                <TableHead>Scanner Serial Number</TableHead>
                                <TableHead>Scanner Model</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Remarks</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Plus className="text-blue-500" />
                                </TableCell>
                                <TableCell>
                                    <Select value={data.office_type} onValueChange={handleSelectChange('office_type')}>
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
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell>
                                    <Select value={data.branch_list_id} onValueChange={handleSelectChange('branch_list_id')}>
                                        <SelectTrigger className="w-50">
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
                                <TableCell>
                                    <Input
                                        value={data.serial_number}
                                        placeholder="Enter scanner serial number"
                                        onChange={handleInputChange('serial_number')}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input value={data.model} placeholder="Enter scanner model" onChange={handleInputChange('model')} />
                                </TableCell>
                                <TableCell>
                                    <Select value={data.status} onValueChange={handleSelectChange('status')}>
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
                                </TableCell>
                                <TableCell>
                                    <Input value={data.remarks} placeholder="Enter remarks" onChange={handleInputChange('remarks')} />
                                </TableCell>
                                <Activity mode={isDirty ? 'visible' : 'hidden'}>
                                    <TableCell>
                                        <Button disabled={processing} type="button" className="text-blue-500" onClick={submitData} variant="outline">
                                            {processing ? <Loader2 size={20} className="h-4 w-4 animate-spin" /> : <Save size={20} />}
                                        </Button>
                                    </TableCell>
                                </Activity>
                            </TableRow>
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
                                <TableRow>
                                    <TableCell className="py-5 text-center" colSpan={9}>
                                        No task added yet
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    variant={'ghost'}
                                    type="button"
                                    onClick={handlePageChange(String(scannerRecordLists?.prev_cursor))}
                                    className={`${!scannerRecordLists?.prev_cursor ? 'pointer-events-none opacity-50' : ''} hover:bg-transparent`}
                                >
                                    <PaginationPrevious />
                                </Button>
                            </PaginationItem>
                            <NativeSelect value={String(scannerRecordLists.per_page)} onChange={handlePerPage}>
                                {[5, 10, 20, 50, 100, 200, 500].map((item, index) => (
                                    <NativeSelectOption value={String(item)} key={index}>
                                        {item}
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>
                            <PaginationItem>
                                <Button
                                    variant={'ghost'}
                                    type="button"
                                    onClick={handlePageChange(String(scannerRecordLists?.next_cursor))}
                                    className={`${!scannerRecordLists?.next_cursor ? 'pointer-events-none opacity-50' : ''} hover:bg-transparent`}
                                >
                                    <PaginationNext />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                    <Toaster />
                </div>
            </div>
        </>
    );
}
