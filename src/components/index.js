import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'


export const AuthNavbar = () => {
  const router = useRouter()
  const pathname = usePathname().split('/')[2]

  const handleAuthClick = () => {
    if (pathname === 'login') {
      router.push('/auth/register')
    } else {
      router.push('/auth/login')
    }
  }

  return (
    <div className='font-poppins'>
      <nav className='grid grid-cols-12 bg-primary-blue-100 py-5'>
        <div className='col-start-2 col-end-12 flex items-center justify-between'>
          <h1 className='text-[2rem] font-black text-white'>
            <Link href='/'>Sage-Warehouse</Link>
          </h1>
          <button
            className='auth-btn h-[4rem] w-fit px-8 py-3 text-[1.4rem] font-medium rounded-md bg-primary-yellow-100 text-primary-blue-100'
            onClick={handleAuthClick}
          >
            {pathname === 'login' ? 'Sign up' : 'Login'}
          </button>
        </div>
      </nav>
    </div>
  )
}
