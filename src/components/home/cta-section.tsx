'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CtaSection() {
    return (
        <section className="py-8">
            <div className="container mx-auto px-4">
                <div className="bg-muted/30 p-6 rounded-lg text-center border">
                    <h3 className="font-bold text-lg text-foreground">¿Sos profesional o tenés un oficio?</h3>
                    <p className="text-muted-foreground text-sm mt-1 mb-4">Sumate a nuestra comunidad y conseguí más clientes.</p>
                    <Link href="/signup">
                        <Button size="lg" className="w-full sm:w-auto">
                            REGISTRATE ACÁ
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
