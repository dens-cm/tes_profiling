import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { collection, query, onSnapshot } from 'firebase/firestore'
import { firestoreDB } from '../config/FirebaseConfig'

export default function Dashboard() {

  const [teachers, setTeachers] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const teachersRef = collection(firestoreDB, `users`)
    const q = query(teachersRef)
    setLoading(true)

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teacherList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))

      setTeachers(teacherList)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <Chakra.Box w='100%' h='100%' p='1.5%' bg='white'>
      <Chakra.Text mb='.5%' fontSize='.9vw' fontWeight='bold' color='gray.600'>Tagongon Elementary School Teachers</Chakra.Text>
      <hr />
      <Chakra.Box w='100%' p='1% 0 0 0' display='flex' flexWrap='wrap'>
        {loading ? (
          <Chakra.Box w='100%' display='flex' alignItems='center' justifyContent='center'>
            <Chakra.Spinner w='1vw' h='1vw' color='gray.500' />
            <Chakra.Text ml='1%' fontSize='.9vw' fontWeight='bold' fontStyle='italic' color='gray.500'>Fetching data...</Chakra.Text>
          </Chakra.Box>
        ) : teachers.length === 0 ? (
          <Chakra.Box w='100%' display='flex' alignItems='center' justifyContent='center'>
            <Chakra.Text fontSize='.9vw' fontWeight='bold' fontStyle='italic' color='gray.500'>
              No teacher found.
            </Chakra.Text>
          </Chakra.Box>
        ) : (
          <>
            {teachers.filter((teacher) => teacher?.userType !== 'admin' && teacher?.status !== 'archive').map((teacher) => (
              <Chakra.Card key={teacher.id} w='15.5%' m='.5%' borderRadius='0' boxShadow='none' border='.1vw solid #f0f1f5' _hover={{ boxShadow: '.3vw .3vw .3vw rgb(105, 126, 116, .3)', bg: '#fbfbfc', transition: '.3s' }} transition='.3s'>
                <Chakra.Image w='100%' h='14vw' objectFit='cover' src={teacher?.profileImageUrl} />
                <Chakra.Box w='100%' p='5%'>
                  <Chakra.Text fontSize='.9vw' fontWeight='bold' color='gray.600' textTransform='capitalize' isTruncated>{teacher?.firstName} {teacher?.middleName} {teacher?.lastName} {teacher?.extensionName}</Chakra.Text>
                  <hr />
                  <Chakra.Text fontSize='.8vw' fontWeight='400' fontStyle='italic' color='gray.500' textTransform='capitalize' isTruncated>{teacher?.adviser}</Chakra.Text>
                </Chakra.Box>
              </Chakra.Card>
            ))}
          </>
        )}
      </Chakra.Box>
    </Chakra.Box>
  )
}
