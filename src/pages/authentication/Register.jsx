import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { TiUser, TiUserAdd, TiMail, TiLockClosedOutline, TiArrowRightThick } from "react-icons/ti"
import { useAuth } from '../../config/Authentication'
import { handleRegister } from '../../utils/authentication/handleRegister'
import { useNavigate } from 'react-router-dom'
import Toast from '../../components/Toast'
import schoolLogo from '../../assets/tes_logo.png'

export default function Register() {

    const emailRef = React.useRef()
    const passwordRef = React.useRef()
    const confirmPasswordRef = React.useRef()
    const [loading, setLoading] = React.useState(false)
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const { signup } = useAuth()
    const showToast = Toast()
    const navigate = useNavigate()

    return (
        <Chakra.Box w='100%' h='100%' bg='#f0f1f5' display='flex' justifyContent='center' alignItems='center' overflow='auto'>
            <Chakra.Box w='30%' p='2%' bg='white' boxShadow='.2vw .2vw .3vw rgba(185, 186, 182, 0.5)'>
                <Chakra.Box w='100%' mb='1%' display='flex' alignItems='center'>
                    <Chakra.Image w='1.5vw' h='1.5vw' mr='1.5%' src={schoolLogo} alt='school logo'/>
                    <Chakra.Text fontSize='1vw' fontWeight='bold' fontStyle='italic' color='gray.600' textTransform='uppercase'>Tagongon Elementary School</Chakra.Text>
                </Chakra.Box>
                <hr />
                <Chakra.Box w='100%' mt='5%' mb='5%' display='flex' alignItems='center' justifyContent='space-between'>
                    <Chakra.Box w='50%' display='flex' alignItems='center'>
                        <Chakra.Text mr='2%' fontSize='1.5vw' fontWeight='bold' color='gray.700'><TiUserAdd /></Chakra.Text>
                        <Chakra.Text fontSize='1.2vw' fontWeight='bold' color='gray.700'>Create account</Chakra.Text>
                    </Chakra.Box>
                    <Chakra.Button onClick={() => navigate('/login')} h='2vw' p='2.5%' fontSize='.8vw' color='gray.700' colorScheme='gray' leftIcon={<TiUser size='1.2vw' />} display='flex' alignItems='center' borderRadius='0' _hover={{ bg: '#094333', color: 'white', transition: '.3s' }} transition='.3s'>Login</Chakra.Button>
                </Chakra.Box>
                <hr />
                <Chakra.Box w='100%' mt='5%'>
                    <Chakra.Text fontSize='1vw' fontWeight='500' color='gray.700'>Register</Chakra.Text>
                    <form onSubmit={(e) => handleRegister(e, emailRef, passwordRef, confirmPasswordRef, setLoading, showToast, signup, navigate)} style={{ w: '100%', margin: '5% 0 0 0' }}>
                        <Chakra.FormLabel m='0' fontSize='.9vw' fontStyle='italic' color='gray.800'>Email:</Chakra.FormLabel>
                        <Chakra.InputGroup h='2.5vw' display='flex' alignItems='center'>
                            <Chakra.Input type='email' required h='100%' fontSize='1vw' placeholder='Enter your email address' borderRadius='0' ref={emailRef} pattern="^\S+$" title="Username cannot contain spaces."/>
                            <Chakra.InputRightElement h='100%'><Chakra.Text fontSize='1.2vw' color='gray.500'><TiMail /></Chakra.Text> </Chakra.InputRightElement>
                        </Chakra.InputGroup>
                        <Chakra.FormLabel m='3% 0 0 0' fontSize='.9vw' fontStyle='italic' color='gray.800'>Password:</Chakra.FormLabel>
                        <Chakra.InputGroup h='2.5vw' display='flex' alignItems='center'>
                            <Chakra.Input type='password' required h='100%' fontSize='1vw' placeholder='Enter your password' borderRadius='0' ref={passwordRef} value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <Chakra.InputRightElement h='100%'><Chakra.Text fontSize='1.3vw' color='gray.500'><TiLockClosedOutline /></Chakra.Text> </Chakra.InputRightElement>
                        </Chakra.InputGroup>
                        <Chakra.FormLabel m='3% 0 0 0' fontSize='.9vw' fontStyle='italic' color='gray.800'>Confirm password:</Chakra.FormLabel>
                        <Chakra.InputGroup h='2.5vw' display='flex' alignItems='center'>
                            <Chakra.Input type='password' required h='100%' fontSize='1vw' placeholder='Enter your password' borderRadius='0'  ref={confirmPasswordRef} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                            <Chakra.InputRightElement h='100%'><Chakra.Text fontSize='1.3vw' color='gray.500'><TiLockClosedOutline /></Chakra.Text> </Chakra.InputRightElement>
                        </Chakra.InputGroup>
                        <Chakra.Button type='submit' isLoading={loading} isDisabled={loading} w='100%' h='2.3vw' mt='7%' fontSize='.9vw' color='white' bg='#e38a2b' rightIcon={<TiArrowRightThick />} borderRadius='0'>Continue</Chakra.Button>
                    </form>
                </Chakra.Box>
            </Chakra.Box>
        </Chakra.Box>
    )
}
