import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BranchList as BranchListTypes } from '@/types/branch-lists';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Loader2, Pen, Trash } from 'lucide-react';
import { Activity, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const schema = z.object({
    branch_name: z.string().nonempty('Branch name is required'),
    branch_code: z
        .string()
        .nonempty('Branch code is required')
        .transform((value) => value.toUpperCase()),
});

export const BranchList = ({ branchLists }: { branchLists: BranchListTypes[] }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        reset,
    } = useForm({
        resolver: zodResolver(schema),
    });
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<{ id: number; isOpen: boolean }>({
        id: 0,
        isOpen: false,
    });

    const handleEdit = (branchList: BranchListTypes) => () => {
        setIsEditing({
            id: branchList.id,
            isOpen: true,
        });
        reset({ branch_name: branchList.branch_name, branch_code: branchList.branch_code });
    };

    const handleCancelEdit = () => {
        setIsEditing({
            id: 0,
            isOpen: false,
        });
        reset({
            branch_name: '',
            branch_code: '',
        });
    };

    const onUpdate = async (data: z.infer<typeof schema>) => {
        await new Promise<void>((resolve) => {
            router.patch(route('branch-lists.update', isEditing.id), data, {
                onSuccess: () => {
                    setIsEditing({
                        id: 0,
                        isOpen: false,
                    });
                    reset({
                        branch_name: '',
                        branch_code: '',
                    });
                    resolve();
                },
                onError: (error) => {
                    Object.keys(error).forEach((key) => {
                        setError(key as keyof typeof data, { message: error[key as keyof typeof data] }, { shouldFocus: true });
                    });
                    resolve();
                },
            });
        });
    };

    const handleDeleteBranchList = (id: number) => () => {
        setIsDeleting(true);
        router.delete(route('branch-lists.destroy', id), {
            preserveState: true,
            onFinish: () => setIsDeleting(false),
        });
    };

    const onSubmit = async (data: z.infer<typeof schema>) => {
        if (isEditing.isOpen) {
            await onUpdate(data);
            return;
        }

        await new Promise<void>((resolve) => {
            router.post(route('branch-lists.store'), data, {
                onSuccess: () => {
                    reset();
                    resolve();
                },
                onError: (error) => {
                    Object.keys(error).forEach((key) => {
                        setError(key as keyof typeof data, { message: error[key as keyof typeof data] });
                    });
                    resolve();
                },
            });
        });
    };

    return (
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden border-r border-slate-200 p-6 dark:border-slate-700 dark:bg-[#242526] dark:from-slate-900 dark:to-slate-800">
            {/* Form Section */}
            <form onSubmit={handleSubmit(onSubmit)} className="mb-6 shrink-0">
                <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#333333]">
                    <h2 className="text-sm font-bold tracking-wide text-slate-900 uppercase dark:text-white">Add Branch</h2>

                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="branch_name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Branch Name
                        </Label>
                        <Input
                            {...register('branch_name')}
                            placeholder="Enter branch name"
                            className="h-10 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 dark:border-slate-600 dark:bg-[#242526] dark:text-white dark:placeholder-slate-400"
                        />
                        <InputError message={errors?.branch_name?.message} />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="branch_code" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Branch Code
                        </Label>
                        <Input
                            {...register('branch_code')}
                            placeholder="Enter branch code"
                            className="h-10 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 dark:border-slate-600 dark:bg-[#242526] dark:text-white dark:placeholder-slate-400"
                        />
                        <InputError message={errors?.branch_code?.message} />
                    </div>

                    <div className="flex flex-col space-y-2 pt-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-10 w-full bg-linear-to-r from-blue-600 to-blue-700 font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : isEditing.isOpen ? (
                                'Update Branch'
                            ) : (
                                'Add Branch'
                            )}
                        </Button>
                        <Activity mode={isEditing.isOpen ? 'visible' : 'hidden'}>
                            <Button
                                type="button"
                                className="h-10 w-full bg-slate-200 font-medium text-slate-700 transition-all hover:bg-slate-300 dark:bg-[#242526] dark:text-slate-200 dark:hover:bg-slate-600"
                                onClick={handleCancelEdit}
                                disabled={!isEditing.isOpen}
                            >
                                Cancel
                            </Button>
                        </Activity>
                    </div>
                </div>
            </form>

            {/* Branch List Section */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <h3 className="mb-4 text-sm font-bold tracking-wide text-slate-900 uppercase dark:text-white">Branches ({branchLists.length})</h3>
                <div className="flex-1 space-y-2 overflow-y-auto pr-2">
                    {branchLists.length > 0 ? (
                        branchLists.map((branchList) => (
                            <div
                                key={branchList.id}
                                className="group flex items-center justify-between rounded-lg border border-slate-300 bg-slate-100 p-3 transition-colors duration-150 hover:border-slate-400 hover:bg-slate-200 dark:border-slate-600 dark:bg-[#3a3a3a] dark:hover:border-slate-500 dark:hover:bg-slate-600"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-200">{`(${branchList.branch_code})`}</p>
                                    <p className="truncate text-xs text-slate-600 dark:text-slate-400">{branchList.branch_name}</p>
                                </div>
                                <div className="ml-2 flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-slate-600 dark:hover:text-blue-300"
                                        onClick={handleEdit(branchList)}
                                    >
                                        <Pen className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        disabled={isDeleting}
                                        className="h-8 w-8 p-0 text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-slate-600 dark:hover:text-red-300"
                                        onClick={handleDeleteBranchList(branchList.id)}
                                    >
                                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex h-20 items-center justify-center text-center">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                No branches yet
                                <br />
                                Add one to get started
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
