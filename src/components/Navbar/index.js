'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ShoppingBagIcon } from '@heroicons/react/24/solid'

import { useSession, signOut } from 'next-auth/react'

import { usePathname } from 'next/navigation'

const styles = {
  navDropdownLink: `block w-full rounded-md px-4 py-4 text-[1rem] hover:rounded-md hover:bg-primary-blue-200 lg:text-[1.4rem]`,
}

export const Navbar = () => {
  const { data } = useSession()

  //my api auth
  // const { isLoggedIn, user } = useAuth()
  console.log(data)
  const handleSignOut = () => { }


  return (
    <div className=''>
      <div className='hidden lg:block'>
        <Desktop data={data} />
      </div>
    </div>
  )
}

const Desktop = ({ data }) => {
  const pathname = usePathname()
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <nav
      className={`grid grid-cols-12 bg-primary-blue-100 py-4 font-poppins`}
    >
      <ul className='col-start-2 col-end-12 mx-auto flex w-full max-w-[144rem] items-center justify-between gap-x-8'>
        <li>
          <h1>
            <Link href='/' className='text-[2rem] font-black text-white'>
              Sage - Warehouse
            </Link>
          </h1>
        </li>
        <li className='lg:w-[30%] xl:w-[40%]'>
          <div className='flex h-[4rem] w-full items-center rounded-sm bg-white hover:ring-2'>
            <input
              type='text'
              placeholder='search'
              className='h-full w-[90%] rounded-md border-0 bg-transparent px-4 text-[1.4rem] outline-0 focus:outline-0'
            />
            <div className='flex h-full w-[10%] cursor-pointer items-center justify-center  '>
              <div className='w-fit rounded-md p-2 transition-all delay-75 hover:bg-primary-blue-300'>
                <MagnifyingGlassIcon className='h-8 w-8 hover:text-white' />
              </div>
            </div>
          </div>
        </li>
        <div className='flex items-center gap-x-4'>
          {data?.user ? (
            <div className='relative h-[4rem] w-[4rem] rounded-full'>
              <Image
                src={data?.photo}
                alt='profile image'
                width={1000}
                height={1000}
                className='h-[4rem] w-[4rem] cursor-pointer rounded-full object-cover'
                onClick={() => setShowDropdown(!showDropdown)}
              />

              {showDropdown && (
                <div className='absolute top-[4.5rem] z-[999] w-[15rem] rounded-xl border bg-[#FFF] py-4 px-2'>
                  <ul className='w-full space-y-1 divide-y'>
                    <li>
                      <Link
                        href='/account/profile'
                        className={styles.navDropdownLink}
                      >
                        {' '}
                        Account{' '}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/account/orders'
                        className={styles.navDropdownLink}
                      >
                        {' '}
                        Orders{' '}
                      </Link>
                    </li>
                    <li>
                      <Link href='/wishlist' className={styles.navDropdownLink}>
                        {' '}
                        Wishlist{' '}
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() =>
                          signOut({
                            redirect: false
                          })
                          // handleSignOut()
                        }
                        className={`${styles.navDropdownLink} text-left`}
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className='flex items-center gap-x-8'>
              {pathname === '/auth/register' ? <li>
                <Link href='/auth/login'>
                  <button
                    className='auth-btn bg-white text-[1.4rem] font-medium rounded-md px-8 py-3 text-primary-blue-100 transition-all delay-75 hover:bg-primary-blue-300 hover:text-white'
                  >
                    Login
                  </button>
                </Link>
              </li> : <li className=''>
                <Link href='/auth/register'>
                  <button className='auth-btn  bg-primary-yellow-100 text-primary-blue-100'>
                    Sign up
                  </button>
                </Link>
              </li>}
            </div>
          )}

          <li>
            <Link href='/cart' className='relative'>
              <ShoppingBagIcon className='h-12 w-12 text-white' />
              {/* <span className='absolute top-0 left-[15px] flex h-[1.5rem] w-[1.5rem] items-center justify-center rounded-full bg-primary-yellow-200 text-white'>
                {cartItems.length}
              </span> */}
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  )
}

