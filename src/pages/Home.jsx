/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { Helmet } from 'react-helmet'
import { ChevronDownIcon, SettingsIcon } from '@chakra-ui/icons'
import { TiMail, TiInputChecked, TiMap, TiUserOutline, TiThLargeOutline, TiGroupOutline, TiFolder } from "react-icons/ti"
import { PencilLine } from 'lucide-react'
import { BiSolidLogOut } from "react-icons/bi"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../config/Authentication'
import useFetchUserData from '../hooks/data/userData'
import useFetchCertificates from '../hooks/data/userCertificates'
import Dashboard from '../views/user/Dashboard'
import Profile from '../views/user/Profile'
import Trainings from '../views/user/Trainings'
import Archived from '../views/user/Archived'
import Teachers from '../views/admin/Teachers'
import Archives from '../views/admin/Archives'
import Post from '../views/admin/Post'
import Logout from '../components/modal/Logout'
import Toast from '../components/Toast'
import SchoolLogo from '../assets/tes_logo.png'

export default function Home() {

    const [fetching, setFetching] = React.useState(false)
    const { currentUser, logout, loading } = useAuth()
    const { userData, userLoading, archive } = useFetchUserData(currentUser)
    const { certificates, loadingCertificates, refreshCertificates } = useFetchCertificates(currentUser.uid)
    const [isEmailVerified, setIsEmailVerified] = React.useState(false)
    const [activeView, setActiveView] = React.useState('dashboard')
    const { isOpen: isOpenLogoutModal, onOpen: onOpenLogoutModal, onClose: onCloseLogoutModal } = Chakra.useDisclosure()
    const navigate = useNavigate()
    const showToast = Toast()

    React.useEffect(() => {
        setFetching(true)

        const checkEmailVerification = async () => {
            try {
                if (currentUser) {
                    await currentUser.reload()
                    const verified = currentUser.emailVerified

                    if (!verified) {
                        setIsEmailVerified(false)
                    }

                    else {
                        setIsEmailVerified(true)
                    }
                }
            }

            catch (error) {
                showToast({ title: 'Error', description: `${error}`, status: 'error', variant: 'solid', position: 'top' })
            }

            finally {
                setFetching(false)
            }

        }

        checkEmailVerification()
    }, [currentUser])

    const resendVerification = async () => {
        setFetching(true)

        try {
            if (currentUser && !currentUser.emailVerified) {
                await currentUser.sendEmailVerification()
                showToast({ title: "Success", description: "A new verification email has been sent. Please check your inbox.", status: "success", position: "top" })
            }

            else {
                showToast({ title: "Info", description: "Your email is already verified.", status: "info", position: "top" })
            }
        }

        catch (error) {
            showToast({ title: "Error", description: `Failed to resend verification email. ${error.message}`, status: "error", position: "top" })
        }

        finally {
            setFetching(false)
        }
    }

    return (
        <Chakra.Box w='100%' h='100%' bg='#f0f1f5'>
            {
                loading || userLoading || fetching ? (
                    <Chakra.Box w='100%' h='100%' bg='white' display='flex' alignItems='center' justifyContent='center'>
                        <Chakra.Spinner w='1.2vw' h='1.2vw' mr='.5%' thickness='.2vw' />
                        <Chakra.Text fontSize='1vw' fontWeight='500'>Please wait</Chakra.Text>
                    </Chakra.Box>
                ) : isEmailVerified === false ?
                    (
                        <Chakra.Box w='100%' h='100%' bg='#f0f1f5' display='flex' alignItems='center' justifyContent='center'>
                            <Helmet>
                                <title>Email Verification - Tagongon Elementary School Profiling System</title>
                                <meta name="description" content="Verify your email address to complete the registration process and access the Tagongon Elementary School Profiling System." />
                                <link rel="icon" type="image/svg+xml" href="/tes_logo.png" />
                            </Helmet>
                            <Chakra.Box w='30%' p='2%' bg='white' boxShadow='.2vw .2vw .4vw rgb(105, 126, 116, .2)'>
                                <Chakra.Box w='100%' mb='1%' display='flex' alignItems='center'>
                                    <Chakra.Text fontSize='1.2vw' mr='1%' fontWeight='bold' color='gray.600'><TiMail /> </Chakra.Text>
                                    <Chakra.Text as="h1" fontSize='1vw' fontWeight='bold' color='gray.600'>Your Email is not verified </Chakra.Text>
                                </Chakra.Box>
                                <hr />
                                <Chakra.Text fontSize='1vw' mt='4%' fontStyle='italic'>Please check your email inbox for verification: <strong>{currentUser.email}</strong></Chakra.Text>
                                <Chakra.Text onClick={resendVerification} fontSize='.9vw' mt='6%' fontStyle='italic' color='blue' cursor='pointer'>Resend email verification link</Chakra.Text>
                                <Chakra.Button onClick={() => window.location.reload()} w='100%' h='2.3vw' mt='2%' mb='2%' fontSize='.8vw' colorScheme='blue' rightIcon={<TiInputChecked fontSize='1.1vw' />} borderRadius='0'>I have verified my email</Chakra.Button>
                                <hr />
                                <Chakra.Button onClick={logout} w='100%' h='2.3vw' mt='2%' fontSize='.8vw' colorScheme='red' rightIcon={<BiSolidLogOut fontSize='.8vw' />} borderRadius='0'>Logout</Chakra.Button>
                            </Chakra.Box>
                        </Chakra.Box>
                    ) : (
                        <Chakra.Box w='100%' h='100%' bg='gray.100' display='flex' flexDirection='column'>
                            <Helmet>
                                <title>Tagongon Elementary School Profiling System</title>
                                <meta name="description" content="Welcome to the Tagongon Elementary School Profiling System, a platform for managing teacher data efficiently and securely." />
                                <link rel="icon" type="image/svg+xml" href="/tes_logo.png" />
                            </Helmet>
                            <Chakra.Box zIndex='5' w='100%' h='7%' p='0 1% 0 1%' bg='white' display='flex' alignItems='center' justifyContent='space-between' boxShadow='.1vw .1vw .3vw rgba(105, 126, 116, .1)'>
                                <Chakra.Box w='19.4%' h='100%' display='flex' alignItems='center'>
                                    <Chakra.Image w='2.2vw' h='2.2vw' mr='1.5%' src={SchoolLogo} alt='school logo' />
                                    <Chakra.Box display='flex' flexDirection='column'>
                                        <Chakra.Text as="h1" fontSize='.8vw' fontWeight='bold' color='gray.600'>Tagongon Elementary School</Chakra.Text>
                                        <hr />
                                        <Chakra.Text as="h5" fontSize='.7vw' fontWeight='500' fontStyle='italic' color='gray.500'>Profiling System</Chakra.Text>
                                    </Chakra.Box>
                                </Chakra.Box>
                                <Chakra.Box w='61.5%' h='70%' p='0 0 0 1%' display='flex' alignItems='center' borderLeft='.1vw solid #b9bab6'>
                                    <Chakra.Text w='100%' fontSize='.8vw' fontWeight='bold' color='gray.600' textTransform='uppercase' display='flex' alignItems='center'>
                                        {userData?.userType === 'admin' ?
                                            (
                                                <>
                                                    {
                                                        activeView === 'dashboard' ?
                                                            (
                                                                <>
                                                                    <Chakra.Text as="h1" mr='1%' fontSize='1.3vw'><TiMap/></Chakra.Text>
                                                                    Dashboard
                                                                </>
                                                            ) :
                                                            activeView === 'post' ?
                                                                (
                                                                    <>
                                                                        <Chakra.Text as="h1" mr='1%' fontSize='1.3vw'><PencilLine size='1vw'/></Chakra.Text>
                                                                        Post
                                                                    </>
                                                                ) :
                                                                activeView === 'listOfTeachers' ?
                                                                    (
                                                                        <>
                                                                            <Chakra.Text as="h1" mr='1%' fontSize='1.3vw'><TiGroupOutline /></Chakra.Text>
                                                                            List of Teachers
                                                                        </>
                                                                    ) :
                                                                    activeView === 'archives' ?
                                                                        (
                                                                            <>
                                                                                <Chakra.Text as="h1" mr='1%' fontSize='1.2vw'><TiFolder /></Chakra.Text>
                                                                                Archives
                                                                            </>
                                                                        ) : null
                                                    }
                                                </>
                                            )
                                            :
                                            (
                                                <>
                                                    {
                                                        activeView === 'dashboard' ?
                                                            (
                                                                <>
                                                                    <Chakra.Text as="h1" mr='1%' fontSize='1.3vw'><TiMap /></Chakra.Text>
                                                                    Dashboard
                                                                </>
                                                            ) :
                                                            activeView === 'profile' ?
                                                                (
                                                                    <>
                                                                        <Chakra.Text as="h1" mr='1%' fontSize='1.2vw'><TiUserOutline /></Chakra.Text>
                                                                        Profile
                                                                    </>
                                                                ) :
                                                                activeView === 'trainings' ?
                                                                    (
                                                                        <>
                                                                            <Chakra.Text as="h1" mr='1%' fontSize='1vw'><TiThLargeOutline /></Chakra.Text>
                                                                            Trainings
                                                                        </>
                                                                    ) : null
                                                    }
                                                </>
                                            )
                                        }

                                    </Chakra.Text>
                                </Chakra.Box>
                                <Chakra.Box w='19.4%' h='100%' display='flex' alignItems='center' justifyContent='right'>
                                    <Chakra.Text mr='3%' fontSize='.8vw' fontWeight='500' color='gray.600' textTransform='capitalize' isTruncated>Hi, {userData?.firstName}</Chakra.Text>
                                    <Chakra.Menu>
                                        <Chakra.MenuButton ml='1%' p='2%' display='flex' transition='all 0.2s' borderRadius='0'>
                                            <Chakra.Avatar w='2vw' h='2vw' bg='gray.100' name={userData?.firstName} src={userData?.profileImageUrl} objectFit='cover' alt='user image' />
                                            <ChevronDownIcon fontSize='1vw' />
                                        </Chakra.MenuButton>
                                        <Chakra.MenuList borderRadius='0'>
                                            <Chakra.MenuItem onClick={() => navigate('/settings')} fontSize='.8vw' display='flex' justifyContent='space-between'>Settings <SettingsIcon fontSize='.7vw' /></Chakra.MenuItem>
                                            <Chakra.MenuDivider />
                                            <Chakra.MenuItem onClick={onOpenLogoutModal} fontSize='.8vw' fontWeight='700' color='gray.600' display='flex' justifyContent='space-between'>Logout <BiSolidLogOut /></Chakra.MenuItem>
                                        </Chakra.MenuList>
                                    </Chakra.Menu>
                                </Chakra.Box>
                            </Chakra.Box>
                            <Chakra.Box w='100%' h='93%' display='flex' bg='white'>
                                {userData?.userType === 'admin' ?
                                    (
                                        <>
                                            <Chakra.Box w='20%' h='100%' p='2% 0 0 0' bg='#094333'>
                                                <Chakra.Button onClick={() => { setActiveView('dashboard') }} w='100%' pl='15%' fontSize='.9vw' fontWeight='400' color='white' display='flex' alignItems='center' justifyContent='left' bg={activeView === 'dashboard' ? 'rgba(227, 138, 43, .3)' : '#0000'} _hover={{ bg: 'rgba(227, 138, 43, 1)' }} borderRight={activeView === 'dashboard' ? '.3vw solid rgba(227, 138, 43, 1)' : '#0000'} leftIcon={<TiMap size='1vw' />} borderRadius='0'>Dashboard</Chakra.Button>
                                                <Chakra.Button onClick={() => { setActiveView('post') }} w='100%' pl='15%' fontSize='.9vw' fontWeight='400' color='white' display='flex' alignItems='center' justifyContent='left' bg={activeView === 'post' ? 'rgba(227, 138, 43, .3)' : '#0000'} _hover={{ bg: 'rgba(227, 138, 43, 1)' }} borderRight={activeView === 'post' ? '.3vw solid rgba(227, 138, 43, 1)' : '#0000'} leftIcon={<PencilLine size='1vw' />} borderRadius='0'>Post</Chakra.Button>
                                                <Chakra.Button onClick={() => { setActiveView('listOfTeachers') }} w='100%' pl='15%' fontSize='.9vw' fontWeight='400' color='white' display='flex' alignItems='center' justifyContent='left' bg={activeView === 'listOfTeachers' ? 'rgba(227, 138, 43, .3)' : '#0000'} _hover={{ bg: 'rgba(227, 138, 43, 1)' }} borderRight={activeView === 'listOfTeachers' ? '.3vw solid rgba(227, 138, 43, 1)' : '#0000'} leftIcon={<TiGroupOutline size='1vw' />} borderRadius='0'>List of Teachers</Chakra.Button>
                                                <Chakra.Button onClick={() => { setActiveView('archives') }} w='100%' pl='15%' fontSize='.9vw' fontWeight='400' color='white' display='flex' alignItems='center' justifyContent='left' bg={activeView === 'archives' ? 'rgba(227, 138, 43, .3)' : '#0000'} _hover={{ bg: 'rgba(227, 138, 43, 1)' }} borderRight={activeView === 'archives' ? '.3vw solid rgba(227, 138, 43, 1)' : '#0000'} leftIcon={<TiFolder size='1vw' />} borderRadius='0'>Archives</Chakra.Button>
                                            </Chakra.Box>
                                        </>
                                    )
                                    :
                                    (
                                        <>
                                            <Chakra.Box w='20%' h='100%' p='2% 0 0 0' bg='#094333'>
                                                <Chakra.Button onClick={() => { setActiveView('dashboard') }} w='100%' pl='15%' fontSize='.9vw' fontWeight='400' color='white' display='flex' alignItems='center' justifyContent='left' bg={activeView === 'dashboard' ? 'rgba(227, 138, 43, .3)' : '#0000'} _hover={{ bg: 'rgba(227, 138, 43, 1)' }} borderRight={activeView === 'dashboard' ? '.3vw solid rgba(227, 138, 43, 1)' : '#0000'} leftIcon={<TiMap size='1.2vw' />} borderRadius='0'>Dashboard</Chakra.Button>
                                                <Chakra.Button onClick={() => { setActiveView('profile') }} w='100%' pl='15%' fontSize='.9vw' fontWeight='400' color='white' display='flex' alignItems='center' justifyContent='left' bg={activeView === 'profile' ? 'rgba(227, 138, 43, .3)' : '#0000'} _hover={{ bg: 'rgba(227, 138, 43, 1)' }} borderRight={activeView === 'profile' ? '.3vw solid rgba(227, 138, 43, 1)' : '#0000'} leftIcon={<TiUserOutline size='1.2vw' />} borderRadius='0'>Profile</Chakra.Button>
                                                <Chakra.Button onClick={() => { setActiveView('trainings') }} w='100%' pl='16%' fontSize='.9vw' fontWeight='400' color='white' display='flex' alignItems='center' justifyContent='left' bg={activeView === 'trainings' ? 'rgba(227, 138, 43, .3)' : '#0000'} _hover={{ bg: 'rgba(227, 138, 43, 1)' }} borderRight={activeView === 'trainings' ? '.3vw solid rgba(227, 138, 43, 1)' : '#0000'} leftIcon={<TiThLargeOutline size='.9vw' />} borderRadius='0'>Trainings</Chakra.Button>
                                            </Chakra.Box>
                                        </>
                                    )
                                }

                                <Chakra.Box w='80%' h='100%' overflow='auto'>
                                    {activeView === 'dashboard' && (
                                        <Chakra.Box w='100%' h='100%'>
                                            {archive ? (
                                                <Archived userData={userData} logout={logout} />
                                            )
                                                :
                                                (
                                                    <Dashboard />
                                                )}
                                        </Chakra.Box>
                                    )}
                                    {activeView === 'profile' && (
                                        <Chakra.Box w='100%' h='100%'>
                                            {archive ? (
                                                <Archived userData={userData} logout={logout} />
                                            )
                                                :
                                                (
                                                    <Profile userData={userData} userLoading={userLoading} certificates={certificates} />
                                                )}
                                        </Chakra.Box>
                                    )}
                                    {activeView === 'trainings' && (
                                        <Chakra.Box w='100%' h='100%'>
                                            {archive ? (
                                                <Archived userData={userData} logout={logout} />
                                            )
                                                :
                                                (
                                                    <Trainings certificates={certificates} loadingCertificates={loadingCertificates} refreshCertificates={refreshCertificates} userType={userData} />
                                                )}
                                        </Chakra.Box>
                                    )}
                                    {activeView === 'post' && (
                                        <Chakra.Box w='100%' h='100%'>
                                            <Post/>
                                        </Chakra.Box>
                                    )}
                                    {activeView === 'listOfTeachers' && (
                                        <Chakra.Box w='100%' h='100%'>
                                            <Teachers userType={userData} />
                                        </Chakra.Box>
                                    )}
                                    {activeView === 'archives' && (
                                        <Chakra.Box w='100%' h='100%'>
                                            <Archives userType={userData} />
                                        </Chakra.Box>
                                    )}
                                </Chakra.Box>
                            </Chakra.Box>
                        </Chakra.Box>
                    )
            }

            <Logout isOpen={isOpenLogoutModal} onClose={onCloseLogoutModal} />
        </Chakra.Box>
    )
}
