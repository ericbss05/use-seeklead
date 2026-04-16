import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AnimatedGroup } from '@/components/animated-group'

const transitionVariants = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    },
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: "spring" as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

const Hero = () => {
    return (
        <div id="hero">
            <div className="relative z-10 pt-20 pb-16 px-6">
                <div className="ambient-glow-hero"></div>
                <div className="max-w-300 mx-auto text-center relative z-20">
                    <AnimatedGroup variants={transitionVariants}>
                        <Badge className="bg-blue-100 backdrop-blur-md mb-8">
                            <span className="text-[11px] font-medium text-gray-700 tracking-wide uppercase">
                                Accès Bêta
                            </span>
                        </Badge>

                        <h1 className="max-w-4xl mx-auto text-center text-5xl md:text-7xl font-medium tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-black via-black to-gray-400 mb-8 leading-[1.05]">
                            Oubliez les outils complexes.
                            <br className="hidden md:block" />
                            Obtenez des leads pertinents{" "}
                            <br /><span className="text-blue-500">en continu.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto mb-12">
                            Une IA qui analyse les interactions LinkedIn et vous livre en continu des prospects réellement
                            intéressés.
                        </p>

                        <form 
                            className="w-full max-w-2xl mx-auto px-4 mb-6"
                        >
                            <div className="flex flex-col justify-center sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                                
                                <div className="bg-foreground/10 rounded-[14px] border p-0.5">
                                <Link href="/login">
                                    <Button
                                        size="lg"
                                        type="submit"
                                        className="rounded-xl px-5 text-base"
                                    >
                                        <span className="text-nowrap">
                                            Rejoindre la bêta
                                        </span>
                                    </Button>
                                </Link>
                                </div>
                            </div>
                        </form>

                        <p className="text-sm text-gray-600 font-light max-w-xl mx-auto mb-20">
                            Inscrivez-vous maintenant pour accéder gratuitement à la bêta
                            <span className="block px-1.5 sm:inline mt-1 sm:mt-0 text-blue-700 font-semibold">
                                avant tout le monde 🚀
                            </span>
                        </p>
                    </AnimatedGroup>
                </div>
            </div>
        </div>
    )
}

export default Hero