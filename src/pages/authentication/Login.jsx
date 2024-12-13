import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { Helmet } from 'react-helmet'
import { TiUser, TiUserAdd, TiMail, TiLockClosedOutline, TiArrowRightThick } from "react-icons/ti"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../config/Authentication'
import { handleLogin } from '../../utils/authentication/handleLogin'
import Toast from '../../components/Toast'
import schoolLogo from '../../assets/tes_logo.png'

export default function Login() {

    const emailRef = React.useRef()
    const passwordRef = React.useRef()
    const [loading, setLoading] = React.useState(false)
    const { login } = useAuth()
    const showToast = Toast()
    const navigate = useNavigate()

    return (
        <Chakra.Box w='100%' h='100%' bg='#f0f1f5' display='flex' justifyContent='center' alignItems='center' overflow='auto'>
            <Helmet>
                <title>Login - Tagongon Elementary School Profiling System</title>
                <meta name="description" content="Log in to the Tagongon Elementary School Profiling System to manage teacher and student data efficiently." />
                <link rel="icon" type="image/svg+xml" href="/tes_logo.png" />
            </Helmet>
            <Chakra.Box w='30%' p='2%' bg='white' boxShadow='.2vw .2vw .3vw rgba(185, 186, 182, 0.5)'>
                <Chakra.Box w='100%' mb='1%' display='flex' alignItems='center'>
                    <Chakra.Image w='1.4vw' h='1.4vw' mr='1.5%' src={schoolLogo} alt='school logo' />
                    <Chakra.Text as="h1" fontSize='.8vw' fontWeight='bold' fontStyle='italic' color='gray.600' textTransform='uppercase'>Tagongon Elementary School</Chakra.Text>
                </Chakra.Box>
                <hr />
                <Chakra.Box w='100%' mt='5%' mb='5%' display='flex' alignItems='center' justifyContent='space-between'>
                    <Chakra.Box w='50%' display='flex' alignItems='center'>
                        <Chakra.Text mr='1%' fontSize='1.3vw' fontWeight='bold' color='gray.700'><TiUser /></Chakra.Text>
                        <Chakra.Text as="h1" fontSize='1vw' fontWeight='bold' color='gray.700'>Welcome Teacher!</Chakra.Text>
                    </Chakra.Box>
                    <Chakra.Button onClick={() => navigate('/register')} h='2vw' p='2.5%' fontSize='.8vw' color='gray.700' colorScheme='gray' leftIcon={<TiUserAdd size='1.2vw' />} display='flex' alignItems='center' borderRadius='0' border='.1vw solid rgb(177, 177, 177)' _hover={{ bg: '#094333', color: 'white', transition: '.3s' }} transition='.3s'>Create Account</Chakra.Button>
                </Chakra.Box>
                <hr />
                <Chakra.Box w='100%' mt='5%'>
                    <Chakra.Text as="h1" fontSize='1vw' fontWeight='500' color='gray.700'>Login to your account</Chakra.Text>
                    <form onSubmit={(e) => handleLogin({ e, emailRef, passwordRef, login, navigate, setLoading, showToast })} style={{ w: '100%', margin: '5% 0 0 0' }}>
                        <Chakra.FormLabel m='0' fontSize='.9vw' fontStyle='italic' color='gray.800'>Email:</Chakra.FormLabel>
                        <Chakra.InputGroup h='2.5vw' display='flex' alignItems='center'>
                            <Chakra.Input type='email' required h='100%' fontSize='1vw' placeholder='Enter your email address' borderRadius='0' ref={emailRef} />
                            <Chakra.InputRightElement h='100%'><Chakra.Text fontSize='1.2vw' color='gray.500'><TiMail /></Chakra.Text> </Chakra.InputRightElement>
                        </Chakra.InputGroup>
                        <Chakra.FormLabel m='3% 0 0 0' fontSize='.9vw' fontStyle='italic' color='gray.800'>Password:</Chakra.FormLabel>
                        <Chakra.InputGroup h='2.5vw' display='flex' alignItems='center'>
                            <Chakra.Input type='password' required h='100%' fontSize='1vw' placeholder='Enter your password' borderRadius='0' ref={passwordRef} />
                            <Chakra.InputRightElement h='100%'><Chakra.Text fontSize='1.3vw' color='gray.500'><TiLockClosedOutline /></Chakra.Text> </Chakra.InputRightElement>
                        </Chakra.InputGroup>
                        <Chakra.Button type='submit' isLoading={loading} isDisabled={loading} w='100%' h='2.3vw' mt='7%' fontSize='.9vw' color='white' bg='#e38a2b' rightIcon={<TiArrowRightThick />} borderRadius='0'>Continue</Chakra.Button>
                        <Chakra.Box w='100%' mt='1.7%' display='flex' justifyContent='center'>
                            <Chakra.Tooltip hasArrow label='reset your password' fontSize='.8vw' placement='auto-start'>
                                <Chakra.Text onClick={() => navigate('/forgot-password')} fontSize='.8vw' fontWeight='400' textAlign='center' color='gray.700' cursor='pointer'>Forgot password?</Chakra.Text>
                            </Chakra.Tooltip>
                        </Chakra.Box>
                    </form>
                </Chakra.Box>
            </Chakra.Box>
        </Chakra.Box>
    )
}
