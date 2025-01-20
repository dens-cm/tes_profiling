import React from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import * as Chakra from '@chakra-ui/react'
import { Helmet } from 'react-helmet'
import { collection, query, onSnapshot } from 'firebase/firestore'
import { firestoreDB } from '../../config/FirebaseConfig'
import { Rocket, MessageCircleHeart, HeartHandshake, UsersRound } from 'lucide-react'
import TES_image from '../../assets/TES_image.jpg'
import image1 from '../../assets/image1.jpg'
import image2 from '../../assets/image2.jpg'
import image3 from '../../assets/image3.jpg'
import image4 from '../../assets/image4.jpg'
import image5 from '../../assets/image5.jpg'
import image6 from '../../assets/image6.jpg'
import image7 from '../../assets/image7.jpg'
import image8 from '../../assets/image8.jpg'
import image9 from '../../assets/image9.jpg'
import image10 from '../../assets/image10.jpg'

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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false
  }

  return (
    <Chakra.Box w='100%' h='100%' backgroundImage={TES_image} userSelect='none'>
      <Chakra.Box w='100%' h='100%' p='1.5%' bg='rgba(255, 255, 255, .9)' display='flex' flexDirection='column' overflow='auto'>
        <Helmet>
          <title>Dashboard - Tagongon Elementary School Profiling System</title>
          <meta name="description" content="Welcome to the Dashboard of the Tagongon Elementary School Profiling System, where you can manage teacher data, view, and access system." />
          <link rel="icon" type="image/svg+xml" href="/tes_logo.png" />
        </Helmet>
        <Chakra.Box w='100%' mt='1%' mb='5%' display='flex' alignItems='center' justifyContent='center'>
          <Chakra.Box w='95%' boxShadow='.3vw .3vw .3vw rgb(105, 126, 116, .3)' cursor='pointer'>
            <Slider {...settings}>
              {[image1, image2, image3, image4, image5, image6, image7, image8, image9, image10].map((imgSrc, index) => (
                <Chakra.Box key={index} w="100%" bg="green" display="flex" alignItems="center" justifyContent="center">
                  <Chakra.Image objectFit="cover" src={imgSrc} alt={`image${index + 1}`} w="100%" h="30vw"/>
                </Chakra.Box>
              ))}
            </Slider>
          </Chakra.Box>
        </Chakra.Box>
        <Chakra.Text as="h1" mb='.4%' fontSize='.9vw' fontWeight='bold' color='white' bg='#094333' p='.5% .5% .5% 1%' display='flex' alignItems='center'><Chakra.Text mr='.5%'><UsersRound size='1vw' strokeWidth='.2vw' /></Chakra.Text>Tagongon Elementary School Teachers</Chakra.Text>
        <hr />
        <Chakra.Box w='100%' display='flex' flexDirection='column'>
          <Chakra.Box w='100%' h='.1vw' bg='#094333'></Chakra.Box>
        </Chakra.Box>
        <Chakra.Box w='100%' p='1% 1% 1.1% 1%' display='flex' alignItems='flex-start' justifyContent='flex-start' flexWrap='wrap'>
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
              {teachers.filter((teacher) => teacher?.userType !== 'admin' && teacher?.status !== 'archive').sort((a, b) => {
                const nameA = `${a?.firstName || ''} ${a?.middleName || ''} ${a?.lastName || ''} ${a?.extensionName || ''}`.toLowerCase()
                const nameB = `${b?.firstName || ''} ${b?.middleName || ''} ${b?.lastName || ''} ${b?.extensionName || ''}`.toLowerCase()
                return nameA.localeCompare(nameB)
              }).map((teacher) => (
                <Chakra.Card key={teacher.id} w='15.5%' m='.5%' borderRadius='0' boxShadow='.3vw .3vw .3vw rgb(105, 126, 116, .3)' border='.1vw solid rgba(9, 67, 51, 0.21)'>
                  <Chakra.Image w='100%' h='14vw' objectFit='cover' src={teacher?.profileImageUrl} alt='teacher image' />
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
        <Chakra.Box w='100%' p='1% .4% 1% .4%' display='flex' justifyContent='space-between'>
          <Chakra.Box w='32%' bg='white' p='1% 1% 2% 1%' boxShadow='.3vw .3vw .3vw rgb(105, 126, 116, .3)'>
            <Chakra.Text as="h1" mt='1.5%' mb='.5%' fontSize='.9vw' fontWeight='bold' color='white' bg='#094333' p='1% 2.5% 1% 2.5%' display='flex' alignItems='center'>Mission <Chakra.Text ml='1.5%'><Rocket size='1vw' /></Chakra.Text></Chakra.Text>
            <Chakra.Text mt='2.5%' fontSize='.9vw' p='0 3% 0 3%' textAlign='justify'>To protect and promote the right of every Filipino to qualify, equitable, culture-based and complete basic education where;</Chakra.Text>
            <Chakra.Text mt='1.5%' fontSize='.9vw' p='0 3% 0 5%' textAlign='justify'> <b>STUDENTS</b> learn in a child-friendly, gender-senitive, safe and motivating environment.</Chakra.Text>
            <Chakra.Text mt='1.5%' fontSize='.9vw' p='0 3% 0 5%' textAlign='justify'> <b>TEACHERS</b> facilitate learning and constantly nurture every learner.</Chakra.Text>
            <Chakra.Text mt='1.5%' fontSize='.9vw' p='0 3% 0 5%' textAlign='justify'> <b>ADMINISTRATORS and STAFF</b> as stewards of the institution, ensure an enabling and supportive environment for effective learning to happen.</Chakra.Text>
            <Chakra.Text mt='1.5%' fontSize='.9vw' p='0 3% 0 5%' textAlign='justify'> <b>FAMILY, COMMUNITY, and other STAKEHOLDERS</b> are actively engaged and share responsibility for developing life-long learners.</Chakra.Text>
          </Chakra.Box>
          <Chakra.Box w='32%' bg='white' p='1% 1% 2% 1%' boxShadow='.3vw .3vw .3vw rgb(105, 126, 116, .3)'>
            <Chakra.Text as="h1" mt='1.5%' mb='.5%' fontSize='.9vw' fontWeight='bold' color='white' bg='#094333' p='1% 2.5% 1% 2.5%' display='flex' alignItems='center'>Vision <Chakra.Text ml='1.5%'><MessageCircleHeart size='1vw' /></Chakra.Text></Chakra.Text>
            <Chakra.Text mt='2.5%' fontSize='.9vw' p='0 3% 0 3%' textAlign='justify'>We dream of Filipinos who passionately love thier country and whose values and competencies enable them to realize thier full potential and contribute meaningfully to building the nation.</Chakra.Text>
            <Chakra.Text mt='1.5%' fontSize='.9vw' p='0 3% 0 3%' textAlign='justify'>As a learner-centered public institution the Department of Education continuously improves itself to better serve its stakeholders.</Chakra.Text>
          </Chakra.Box>
          <Chakra.Box w='32%' bg='white' p='1% 1% 2% 1%' boxShadow='.3vw .3vw .3vw rgb(105, 126, 116, .3)'>
            <Chakra.Text as="h1" mt='1.5%' mb='.5%' fontSize='.9vw' fontWeight='bold' color='white' bg='#094333' p='1% 2.5% 1% 2.5%' display='flex' alignItems='center'>Core Values <Chakra.Text ml='1.5%'><HeartHandshake size='1vw' /></Chakra.Text></Chakra.Text>
            <Chakra.Text mt='2.5%' fontSize='.9vw' p='0 3% 0 3%' textAlign='justify'> <b>• Maka-diyos</b></Chakra.Text>
            <Chakra.Text mt='1.5%' fontSize='.9vw' p='0 3% 0 3%' textAlign='justify'> <b>• Maka-tao</b></Chakra.Text>
            <Chakra.Text mt='1.5%' fontSize='.9vw' p='0 3% 0 3%' textAlign='justify'> <b>• Maka-kalikasan</b></Chakra.Text>
            <Chakra.Text mt='1.5%' fontSize='.9vw' p='0 3% 0 3%' textAlign='justify'> <b>• Maka-bansa</b></Chakra.Text>
          </Chakra.Box>
        </Chakra.Box>
      </Chakra.Box>

    </Chakra.Box>
  )
}
