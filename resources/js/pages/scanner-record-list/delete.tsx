import { Button } from '@/components/ui/button';
import { formatDueDate } from '@/utils/formatDueDate';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function DeleteScannerRecord() {
    const { ScannerRecordList }: any = usePage().props;
    const { processing, delete: deleteData } = useForm();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        deleteData(route('destroy', ScannerRecordList.id));
    };

    return (
        <div>
            <Head title="Delete Task" />
            <div className="flex h-screen items-center justify-center">
                <div className="w-md max-w-lg space-y-3 rounded border border-red-400 bg-red-100 p-5 text-red-700 shadow-lg">
                    <div className="flex flex-col rounded px-4 py-3 text-center">
                        <strong className="text-xl font-bold">Delete Task</strong>
                        <span className="block sm:inline">Are you sure you want to delete this task?</span>
                        <span>{`This task is ${formatDueDate(ScannerRecordList.due_date)} and the status of this task is ${ScannerRecordList.status}.`}</span>
                    </div>
                    <form onSubmit={submit}>
                        <div className="flex items-center gap-1">
                            <Button type="submit" disabled={processing} className="w-full rounded bg-red-500 p-2 text-sm text-white hover:bg-red-600">
                                {processing ? (
                                    <>
                                        <Loader2 className="animate-spin" /> Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="far fa-trash" /> Yes, Delete
                                    </>
                                )}
                            </Button>
                            <Link
                                href={route('index')}
                                className="w-full rounded bg-gray-500 p-2 text-center text-sm text-white hover:bg-gray-600"
                            >
                                <i className="far fa-close" /> Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
