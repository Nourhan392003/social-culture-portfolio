'use client'
import toast from 'react-hot-toast'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            toast.error("بيانات الدخول غلط ❌")
        } else {
            toast.success("تم تسجيل الدخول 🔥")
            setTimeout(() => {
                window.location.href = '/'

            }, 1000)
        }
    }


    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top left, #001a12, #000)',
        }}>

            <div style={{
                background: 'rgba(15,42,31,0.9)',
                padding: '50px 40px',
                borderRadius: '24px',
                width: '380px',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0,255,136,0.2)',
                boxShadow: '0 0 40px rgba(0,255,136,0.15)',
                transition: '0.3s',
            }}>

                <h1 style={{
                    marginBottom: '35px',
                    textAlign: 'center',
                    fontSize: '26px',
                    letterSpacing: '1px'
                }}>
                    🔐 Admin Login
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '14px',
                        marginBottom: '18px',
                        borderRadius: '12px',
                        border: '1px solid rgba(0,255,136,0.2)',
                        background: '#0b2017',
                        color: 'white',
                        outline: 'none',
                        transition: '0.3s',
                        textAlign: 'left',
                        direction: 'ltr'
                    }}

                    onFocus={(e) =>
                        e.currentTarget.style.boxShadow =
                        '0 0 12px rgba(0,255,136,0.6)'
                    }
                    onBlur={(e) =>
                        e.currentTarget.style.boxShadow = 'none'
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '14px',
                        marginBottom: '18px',
                        borderRadius: '12px',
                        border: '1px solid rgba(0,255,136,0.2)',
                        background: '#0b2017',
                        color: 'white',
                        outline: 'none',
                        transition: '0.3s',
                        textAlign: 'left',
                        direction: 'ltr'
                    }}

                    onFocus={(e) =>
                        e.currentTarget.style.boxShadow =
                        '0 0 12px rgba(0,255,136,0.6)'
                    }
                    onBlur={(e) =>
                        e.currentTarget.style.boxShadow = 'none'
                    }
                />

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: loading
                            ? '#007f55'
                            : 'linear-gradient(90deg,#00ff88,#00cc6a)',
                        color: 'black',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: '0.3s',
                        boxShadow: '0 0 15px rgba(0,255,136,0.4)'
                    }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

            </div>
        </div>
    )
}
