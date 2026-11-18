import React, { useState } from 'react';
import { Camera, Upload, CheckCircle2, ShieldCheck, ArrowRight, Loader2, FileText } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/button';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface VerificationPromptProps {
    user: User | null;
    onVerificationSubmitted: () => void;
}

const VerificationPrompt: React.FC<VerificationPromptProps> = ({ user, onVerificationSubmitted }) => {
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [files, setFiles] = useState({
        nationalId: null as File | null,
        selfie: null as File | null,
        roleProof: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof files) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
        }
    };

    const uploadFile = async (file: File, path: string) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}-${path}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('verification-docs')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        // The bucket is private, so store the file path (not a public link).
        // Verifiers open it with a short-lived signed URL.
        return filePath;
    };

    const handleSubmit = async () => {
        if (!files.nationalId || !files.selfie || !files.roleProof || !user) {
            alert("Please upload all required documents first.");
            return;
        }

        setSubmitting(true);
        try {
            // 1. Upload files to Storage Bucket
            const idUrl = await uploadFile(files.nationalId, 'national_id');
            const selfieUrl = await uploadFile(files.selfie, 'selfie');
            const roleUrl = await uploadFile(files.roleProof, 'role_proof');

            // 2. Insert into verification_documents
            const { error: insertError } = await supabase
                .from('verification_documents')
                .insert({
                    user_id: user.id,
                    national_id_url: idUrl,
                    selfie_url: selfieUrl,
                    role_proof_document_url: roleUrl,
                    status: 'pending'
                });

            if (insertError) throw insertError;

            // 3. Update Profile status to pending_review
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ verification_status: 'pending_review' })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Success
            onVerificationSubmitted();
        } catch (error: any) {
            console.error("Verification Submission Error:", error);
            alert("There was an error submitting your documents. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="max-w-xl mx-auto p-6 md:p-8 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/3 -translate-y-1/3" />

            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">Become a Verified Publisher</h2>
                    <p className="text-sm text-slate-600">To maintain trust in the platform, project publishing requires identity verification.</p>
                </div>
            </div>

            {/* Stepper Logic (Simplified for MVP) */}
            <div className="space-y-6">

                {/* Step 1: National ID */}
                <div className={`p-4 rounded-xl border-2 transition-all ${files.nationalId ? 'border-green-200 bg-green-50/50' : 'border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            1. National ID / Passport
                            {files.nationalId && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        </h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">Upload a clear photo of your official government ID.</p>
                    <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer overflow-hidden relative">
                        {files.nationalId ? (
                            <span className="text-sm font-bold text-green-600">{files.nationalId.name}</span>
                        ) : (
                            <div className="flex flex-col items-center text-slate-500">
                                <Upload className="w-5 h-5 mb-1" />
                                <span className="text-xs">Click to upload image</span>
                            </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'nationalId')} />
                    </label>
                </div>

                {/* Step 2: Selfie */}
                <div className={`p-4 rounded-xl border-2 transition-all ${files.selfie ? 'border-green-200 bg-green-50/50' : 'border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            2. Live Selfie verification
                            {files.selfie && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        </h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">Take a clear picture of your face to match your ID.</p>
                    <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer">
                        {files.selfie ? (
                            <span className="text-sm font-bold text-green-600">{files.selfie.name}</span>
                        ) : (
                            <div className="flex flex-col items-center text-slate-500">
                                <Camera className="w-5 h-5 mb-1" />
                                <span className="text-xs">Click to take/upload selfie</span>
                            </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" capture="user" onChange={(e) => handleFileChange(e, 'selfie')} />
                    </label>
                </div>

                {/* Step 3: Proof of Role */}
                <div className={`p-4 rounded-xl border-2 transition-all ${files.roleProof ? 'border-green-200 bg-green-50/50' : 'border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            3. Proof of Role Documents
                            {files.roleProof && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        </h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">Upload documents proving your authority (e.g. NGO Registration, Govt ID Badge, Community Letter).</p>
                    <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer">
                        {files.roleProof ? (
                            <span className="text-sm font-bold text-green-600">{files.roleProof.name}</span>
                        ) : (
                            <div className="flex flex-col items-center text-slate-500">
                                <FileText className="w-5 h-5 mb-1" />
                                <span className="text-xs">Select PDF or Image</span>
                            </div>
                        )}
                        <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'roleProof')} />
                    </label>
                </div>
            </div>

            <Button
                onClick={handleSubmit}
                disabled={!files.nationalId || !files.selfie || !files.roleProof || submitting}
                className="w-full mt-8 py-6 text-lg"
            >
                {submitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Securely Submitting...</>
                ) : (
                    <><ShieldCheck className="w-5 h-5 mr-2" /> Submit Verification Request <ArrowRight className="w-5 h-5 ml-2" /></>
                )}
            </Button>

            <p className="text-xs text-center text-slate-400 mt-4">
                By submitting, you agree to our Terms of Identity Service. Documents are encrypted and only accessible to National Admins.
            </p>
        </Card>
    );
};


export default VerificationPrompt;
