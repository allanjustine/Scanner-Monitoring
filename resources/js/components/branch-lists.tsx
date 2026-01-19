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
        <div className="mt-5 flex flex-col space-y-5 rounded-xl border p-10">
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

                    <div className="flex flex-col space-y-1">
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                            {isSubmitting ? <Loader2 className="animate-spin" /> : isEditing.isOpen ? 'Update' : 'Submit'}
                        </Button>
                        <Activity mode={isEditing.isOpen ? 'visible' : 'hidden'}>
                            <Button
                                type="button"
                                className="w-full bg-red-500 text-white hover:bg-red-600"
                                onClick={handleCancelEdit}
                                disabled={!isEditing.isOpen}
                            >
                                Cancel
                            </Button>
                        </Activity>
                    </div>
                </div>
            </form>

            <div>
                <h1 className="text-md font-bold uppercase">Branch lists</h1>
                <div className="h-[calc(100vh-20rem)] overflow-y-auto">
                    {branchLists.length > 0 ? (
                        branchLists.map((branchList) => (
                            <div key={branchList.id} className="my-2 flex items-center justify-between rounded-md bg-gray-900 p-2 hover:bg-gray-800">
                                <p className="text-gray-200">{`(${branchList.branch_code}) - ${branchList.branch_name}`}</p>
                                <div className="flex flex-col gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="text-x p-1 text-blue-500 hover:text-blue-600"
                                        onClick={handleEdit(branchList)}
                                    >
                                        <Pen />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        disabled={isDeleting}
                                        className="p-1 text-xs text-red-500 hover:text-red-600"
                                        onClick={handleDeleteBranchList(branchList.id)}
                                    >
                                        {isDeleting ? <Loader2 className="animate-spin" /> : <Trash />}
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No branch list added yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};
