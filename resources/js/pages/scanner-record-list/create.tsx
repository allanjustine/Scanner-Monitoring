import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Save } from 'lucide-react';
import { ChangeEvent, FormEventHandler } from 'react';

interface ScannerRecordForm {
    task: string;
    description: string;
    due_date: string;
}

export default function CreateScannerRecord() {
    const { processing, post, errors, data, setData, reset } = useForm<Required<ScannerRecordForm>>({
        task: '',
        description: '',
        due_date: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleChange = (title: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setData((data) => ({
            ...data,
            [title]: value,
        }));
    };

    return (
        <>
            <Head title="Create Task" />
            <div className="grid h-screen place-content-center">
                <div className="w-lg rounded border border-gray-500 p-5">
                    <h1 className="text-center text-2xl font-bold">Create Task</h1>
                    <form className="space-y-2" onSubmit={submit}>
                        <div>
                            <Label htmlFor="task">Task</Label>
                            <Input type="text" id="task" value={data.task} onChange={handleChange('task')} />
                            <InputError message={errors.task} />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input type="text" id="description" value={data.description} onChange={handleChange('description')} />
                            <InputError message={errors.description} />
                        </div>
                        <div>
                            <Label htmlFor="due_date">Due date</Label>
                            <Input type="datetime-local" id="due_date" value={data.due_date} onChange={handleChange('due_date')} />
                            <InputError message={errors.due_date} />
                        </div>
                        <Button
                            disabled={processing}
                            type="submit"
                            className="flex w-full items-center gap-1 bg-blue-500 hover:bg-blue-600"
                            variant="outline"
                        >
                            {processing ? (
                                <>
                                    <LoaderCircle className="animate-spin" /> <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Save /> <span>Submit</span>
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
