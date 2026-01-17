import InputError from '@/components/input-error';
import ScannerRecordLists from '@/components/scanner-record-lists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster } from '@/components/ui/sonner';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SharedData } from '@/types';
import { BranchList } from '@/types/branch-lists';
import { ScannerRecordList } from '@/types/scanner-record-lists';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, useForm as useFormInertia, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { ChangeEvent, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const schema = z.object({
    branch_name: z.string().nonempty('Branch name is required'),
    branch_code: z
        .string()
        .nonempty('Branch code is required')
        .transform((value) => value.toUpperCase()),
});

export default function Index({
    scannerRecordLists,
    branchLists,
    selectableBranchLists,
}: {
    scannerRecordLists: ScannerRecordList[];
    branchLists: BranchList[];
    selectableBranchLists: BranchList[];
}) {
    const { flash } = usePage<SharedData>().props;
    const debounceRef = useRef<NodeJS.Timeout>(null);
    const {
        data,
        setData,
        post,
        processing,
        reset: resetItem,
    } = useFormInertia({
        office_type: '',
        branch_list_id: '',
        serial_number: '',
        model: '',
        status: '',
        remarks: '',
    });

    useEffect(() => {
        if (flash.success) {
            toast.success('Success', {
                description: flash.success,
                duration: 5000,
                position: 'bottom-center',
            });
        }
        if (flash.error) {
            toast.error('Error', {
                description: flash.error,
                duration: 5000,
                position: 'bottom-center',
            });
        }
    }, [flash]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: z.infer<typeof schema>) => {
        post(route('branch-lists.store', data), {
            onSuccess: () => reset(),
        });
    };

    const handleSelectChange = (field: keyof typeof data) => (value: string) => {
        setData((item) => ({
            ...item,
            [field]: value,
        }));

        post(route('scanner-record-lists.store', { field, value }), {
            onSuccess: () => resetItem(),
        });
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

            post(route('scanner-record-lists.store', { field, value }), {
                onSuccess: () => resetItem(),
            });
        }, 1500);
    };

    return (
        <>
            <Head title="Home" />
            <div className="grid grid-cols-[20%_80%]">
                <div className="flex flex-col space-y-5 p-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-5">
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="branch_name" className="text-gray-200">
                                    Branch name
                                </Label>
                                <Input {...register('branch_name')} placeholder="Enter branch name" />
                                <InputError message={errors?.branch_name?.message} />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="branch_code" className="text-gray-200">
                                    Branch code
                                </Label>
                                <Input {...register('branch_code')} placeholder="Enter branch code" />
                                <InputError message={errors?.branch_code?.message} />
                            </div>
                            <Button type="submit" disabled={processing} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                                {processing ? <Loader2 className="animate-spin" /> : 'Submit'}
                            </Button>
                        </div>
                    </form>

                    <div>
                        <h1 className="text-md font-bold uppercase">Branch lists</h1>
                        <div className="h-150 overflow-y-auto">
                            {branchLists.length > 0 ? (
                                branchLists.map((branchList, index) => (
                                    <div key={index} className="my-2 rounded-md bg-gray-600 p-2 hover:bg-gray-700">
                                        <p className="text-gray-200">{`(${branchList.branch_code}) - ${branchList.branch_name}`}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No branch list added yet</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-10">
                    <div className="flex justify-between">
                        <h1 className="text-lg">Scanner records</h1>
                    </div>

                    <Table>
                        <TableCaption>A list of your recent scanner records.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
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
                            {scannerRecordLists.length > 0 ? (
                                scannerRecordLists.map((scannerRecordList, index) => (
                                    <ScannerRecordLists
                                        key={index}
                                        scannerRecordList={scannerRecordList}
                                        selectableBranchLists={selectableBranchLists}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell className="py-5 text-center" colSpan={9}>
                                        No task added yet
                                    </TableCell>
                                </TableRow>
                            )}

                            <TableRow>
                                <TableCell></TableCell>

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
                                                    selectableBranchLists.map((item, index) => (
                                                        <SelectItem key={index} value={String(item.id)}>
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
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Toaster />
                </div>
            </div>
        </>
    );
}
