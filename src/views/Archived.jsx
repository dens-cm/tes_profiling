/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { TiArrowSync } from "react-icons/ti"
import { BiLogOut } from "react-icons/bi"

export default function Archived({ userData, logout }) {
    return (
        <Chakra.Box w='100%' h='100%' bg='white' display='flex' alignItems='center' justifyContent='center'>
            <Chakra.Box w='45%'>
                <Chakra.Text fontSize='1vw' fontWeight='bold' fontStyle='italic' color='gray.500'>Your account has been archived.</Chakra.Text>
                <hr/>
                <Chakra.Box mt='5%' display='flex' alignItems='center'>
                    <Chakra.Image w='3vw' h='3vw' borderRadius='full' src={userData?.profileImageUrl} alt='user image'/>
                    <Chakra.Box ml='3%' display='flex' flexDirection='column'>
                        <Chakra.Text fontSize='1vw' fontWeight='700' color='gray.600' textTransform='capitalize'>{userData?.firstName} {userData?.middleName} {userData?.lastName} {userData?.extensionName}</Chakra.Text>
                        <hr/>
                        <Chakra.Text fontSize='.9vw' fontStyle='italic' color='gray.500'>{userData?.adviser}</Chakra.Text>
                    </Chakra.Box>
                </Chakra.Box>
                <Chakra.Text mt='3%' mb='5%' fontSize='.9vw' fontWeight='500' fontStyle='italic' color='gray.500'>Please contact the admin to retrieve your account. You can refresh the page or log out below.</Chakra.Text>
                <hr/>
                <Chakra.Box w='100%' mt='1.4%' display='flex' justifyContent='right'>
                    <Chakra.Button onClick={logout} leftIcon={<BiLogOut/>} h='1.8vw' mr='1%' fontSize='.8vw' fontWeight='400' colorScheme='red' borderRadius='0'>Logout</Chakra.Button>
                    <Chakra.Button onClick={() => window.location.reload()} leftIcon={<TiArrowSync/>} h='1.8vw' fontSize='.8vw' fontWeight='400' colorScheme='teal' borderRadius='0'>Refresh</Chakra.Button>
                </Chakra.Box>
            </Chakra.Box>
        </Chakra.Box>
    )
}
