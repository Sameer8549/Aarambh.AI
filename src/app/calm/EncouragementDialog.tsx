
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface EncouragementDialogProps {
    showDialog: boolean;
    setShowDialog: (open: boolean) => void;
    isLoading: boolean;
    encouragement: string;
    t: (key: string) => string;
}

export default function EncouragementDialog({
    showDialog,
    setShowDialog,
    isLoading,
    encouragement,
    t,
}: EncouragementDialogProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('calm.dialogTitle')}</DialogTitle>
                </DialogHeader>
                <div className="pt-4 text-center text-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <p>{encouragement}</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
