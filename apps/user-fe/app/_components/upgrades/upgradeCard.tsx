'use client';
import Image from 'next/image';
import { useState } from 'react';
import { checkBadge } from '../../assets';
import { Button } from '@repo/ui/button';
import { cn } from '@repo/ui/utils';
import { Switch } from './toggleSwitch';

const plans = [
    {
        name: 'Basic',
        price: 59,
        description: 'Samay ke dost',
        features: [
            'Bonus episodes',
            'Access to members only live streams',
            'Access to members only live chat',
            'Discord basic samay ke dost role',
        ],
    },
    {
        name: 'Premium',
        price: 599,
        description: 'Samay ke Supporter',
        features: [
            'Get access to latent deleted footage',
            'Access to members only live streams',
            'Access to members only live chat',
            'Discord basic samay ke dost role',
            'Other parterened shows access',
            'Weekly Talkshows',
            '2 Device login'
        ],
    },
    {
        name: 'Standard',
        price: 159,
        description: 'Samay ke Khaas',
        features: [
            'Bonus Episodes',
            'Get access to latent deleted footage',
            'Access to members only live streams',
            'Access to members only live chat',
            'Discord Standard samay ke khaas role',
            'Other parterned shows access',
            'Talkshows will be taken for granted',
            '2 Device login'
        ],
    },
];
export function UpgradeCard() {
    const [selected, setSelected] = useState('');
    const [amount, setAmount] = useState(0);
    const [toggle, setYearToggle] = useState(false)
    
    return (
        <div className='flex flex-col'>

            {/* Toggle Yearly */}
            <div className='flex justify-center gap-2 lg:pb-20'>
                Yearly <Switch onClick={() => {
                    setYearToggle(!toggle)
                    setSelected('')
                    setAmount(0)
                }} className='bg-black' />
                <span className='font-semibold text-transparent bg-gradient-to-r from-[#AA823D] via-[#EFE288] to-[#D1B85A] bg-clip-text'>
                    Save 16%
                </span>
            </div>

            {/* Plans */}
            <div className="flex flex-col gap-3 lg:flex-row">
                {plans.map((val, index) => (
                    <div
                        className={cn(
                            'border rounded-lg px-5 pt-20 w-96  transition-all duration-300 ease-in-out lg:hover:shadow-yellow-600',
                            'bg-black shadow-xl lg:shadow-[#AA823D] flex flex-col',
                            index === 1
                                ? 'lg:scale-110 lg:-mt-10 z-10'
                                : 'lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-105',
                            selected === val.name ? 'border-2 border-orange-500 lg:opacity-100' : 'border-white'
                        )}
                        key={val.name}
                    >
                        <div className='flex-grow space-y-2'>
                            <div className='text-2xl'>{val.name}</div>
                            <div className='font-bold text-5xl'>
                                {toggle ? val.price * 10 : val.price} INR<span className='text-xl'>{toggle ? `/yearly` : '/monthly'}</span>
                            </div>
                            <div>{val.description}</div>
                            <div className='space-y-2'>
                                {val.features.map((feature, idx) => (
                                    <div className='flex items-center' key={idx}>
                                        <Image aria-hidden src={checkBadge} alt='latentPremium' />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div
                            className={`mt-auto pb-6 px-4`}
                        >
                            <Button
                                className={cn(
                                    'px-6 py-5 bg-gradient-to-r from-[#aa823d] via-[#efe188] to-[#d1b759] rounded-xl text-black text-md',
                                    'hover:opacity-90 transition-opacity w-full shadow-[0_0_15px_rgba(170,130,61,0.3)]'
                                )}
                                onClick={() => {
                                    setSelected(val.name)
                                    toggle ? setAmount(val.price * 10) : setAmount(val.price)
                                }}
                            >
                               <span> Upgrade To {val.name}</span>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}