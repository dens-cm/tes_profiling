/* eslint-disable no-unused-vars */
import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { TiTimes, TiHome  } from "react-icons/ti"
import { useNavigate } from 'react-router-dom'
import pageNotFound from './assets/404.png'

export default function PageNotFound() {

  const navigate = useNavigate()

  return (
    <Chakra.Box w='100%' h='100%' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
      <Chakra.Image w='10vw' h='10vw' src={pageNotFound} alt='404 page not found'/>
      <Chakra.Text fontSize='1vw' fontWeight='700' fontStyle='italic'>Page not found</Chakra.Text>
      <TiTimes size='1vw'/>
      <Chakra.Button onClick={() => navigate('/')} h='2vw' mt='2%' fontSize='.8vw' fontWeight='bold' colorScheme='teal' leftIcon={<TiHome />} borderRadius='0'>Home</Chakra.Button>
    </Chakra.Box>
  )
}
