/* eslint-disable react/prop-types */
import React from 'react'
import dayjs from 'dayjs'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as Chakra from '@chakra-ui/react'
import { useReactToPrint } from 'react-to-print'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { MaterialReactTable } from 'material-react-table'
import { HiPhone, HiMiniMapPin, HiEnvelope } from "react-icons/hi2"
import { SmallCloseIcon } from '@chakra-ui/icons'
import { TiUser, TiExport, TiDownload } from "react-icons/ti"
import { BiPrinter } from "react-icons/bi"
import { saveCSV } from '../../utils/xlsx/SaveCSV'
import useFetchCertificates from '../../hooks/data/userCertificates'
import ViewCertificate from './ViewCertificate'

export default function ViewTeacherData({ isOpen, onClose, user, userType }) {

    const [teachingExperience, setTeachingExperience] = React.useState('')
    const { certificates } = useFetchCertificates(user?.id)
    const [selectedCertificate, setSelectedCertificate] = React.useState(null)
    const { isOpen: isOpenUserCertificate, onOpen: onOpenUserCertificate, onClose: onCloseUserCertificate } = Chakra.useDisclosure()
    const contentRef = React.useRef(null)
    const certificateContentRef = React.useRef(null)
    const [loading, setLoading] = React.useState()

    React.useEffect(() => {
        const calculateExperience = () => {
            if (user?.firstDayOfService) {
                const firstDay = dayjs(user.firstDayOfService)
                const now = dayjs()

                const years = now.diff(firstDay, 'year')
                const months = now.diff(firstDay.add(years, 'year'), 'month')
                const days = now.diff(firstDay.add(years, 'year').add(months, 'month'), 'day')

                const yearText = years === 1 ? 'year' : 'years'
                const monthText = months === 1 ? 'month' : 'months'
                const dayText = days === 1 ? 'day' : 'days'

                const experienceText = `${years} ${yearText}, ${months} ${monthText} and ${days} ${dayText}`
                setTeachingExperience(experienceText)
            }
        }

        calculateExperience()
    }, [user])

    const columns = React.useMemo(
        () => [
            {
                accessorKey: 'title',
                header: 'Title',
                size: 10,
                Cell: ({ cell }) => (
                    <Chakra.Text textTransform="capitalize">{cell.getValue()}</Chakra.Text>
                )
            },
            {
                accessorKey: 'venue',
                header: 'Venue',
                size: 7,
                Cell: ({ cell }) => (
                    <Chakra.Text textTransform="capitalize">{cell.getValue()}</Chakra.Text>
                )
            },
            {
                accessorKey: 'sponsoringAgency',
                header: 'Sponsoring Agency',
                size: 7,
                Cell: ({ cell }) => (
                    <Chakra.Text textTransform="capitalize">{cell.getValue()}</Chakra.Text>
                )
            },
            {
                accessorKey: 'date',
                header: 'Date',
                size: 5,
                Cell: ({ cell }) => (
                    <Chakra.Text>{new Date(cell.getValue()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                )
            },
        ],
        []
    )

    const theme = createTheme({
        shadows: ["none"]
    })

    const handlePrint = useReactToPrint({
        contentRef,
        removeAfterPrint: true,
        includeStyles: true,
        pageStyle: `
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                }
                @page {
                    margin: 1in !important; 
                }
            }
        `,
        onBeforeGetContent: () => {
            setLoading(true)
        },

        onAfterPrint: () => {
            setLoading(false)
        },
    })

    const handleCertificatePrint = useReactToPrint({
        contentRef: certificateContentRef,
        removeAfterPrint: true,
        includeStyles: true,
        pageStyle: `
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                }
                @page {
                    margin: 1in !important; 
                }
            }
        `,
        onBeforeGetContent: () => {
            setLoading(true)
        },

        onAfterPrint: () => {
            setLoading(false)
        },
    })

    const handleRowClick = (row) => {
        setSelectedCertificate(row.original)
        onOpenUserCertificate()
    }

    const handleSaveCSV = () => {
        saveCSV(certificates, columns, `certificates`)
    }

    const capitalizeWords = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase())
    }

    const handleSaveAsPDF = () => {
        const doc = new jsPDF()

        const tableData = certificates.map((cert) => [
            capitalizeWords(cert.title),
            capitalizeWords(cert.venue),
            capitalizeWords(cert.sponsoringAgency),
            new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        ])

        const tableHeaders = ['Title', 'Venue', 'Sponsoring Agency', 'Date']

        const totalWidth = doc.internal.pageSize.getWidth() - 50
        const columnWidths = [
            (totalWidth * 30) / 100,
            (totalWidth * 25) / 100,
            (totalWidth * 25) / 100,
            (totalWidth * 20) / 100,
        ]

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            margin: { top: 23, right: 23, bottom: 23, left: 23 },
            styles: {
                fontSize: 10,
                cellPadding: 2,
                lineWidth: 0.1,
                lineColor: [150, 150, 150],
            },
            headStyles: {
                fontStyle: 'bold',
                minCellHeight: 10,
                valign: 'middle',
                fillColor: [200, 200, 200],
                textColor: 0
            },
            bodyStyles: {
                fontSize: '9',
                valign: 'middle',
                minCellHeight: '8'
            },
            alternateRowStyles: {
                fillColor: [255, 255, 255],
            },
            columnStyles: {
                0: { cellWidth: columnWidths[0] },
                1: { cellWidth: columnWidths[1] },
                2: { cellWidth: columnWidths[2] },
                3: { cellWidth: columnWidths[3] },
            }
        })

        doc.save('certificates.pdf')
    }

    return (
        <Chakra.Modal isOpen={isOpen} onClose={onClose} size='full'>
            <Chakra.ModalContent w='100%' h='100%' bg='gray.100'>
                <Chakra.ModalHeader zIndex='1' w='100%' bg='white' display='flex' alignItems='center' justifyContent='space-between' boxShadow='.1vw .1vw .3vw rgba(105, 126, 116, .1)'>
                    <Chakra.Box w='33%'>
                        <Chakra.Text fontSize='1vw' fontWeight='bold' color='gray.700' display='flex' alignItems='center'> <Chakra.Text mr='1%' fontSize='1.3vw'><TiUser /></Chakra.Text> Teacher Data</Chakra.Text>
                    </Chakra.Box>
                    <Chakra.Box w='33%' display='flex' justifyContent='center'>
                        <Chakra.Button onClick={handlePrint} v isLoading={loading} h='1.8vw' fontSize='.8vw' colorScheme='teal' leftIcon={<BiPrinter />} borderRadius='0'>Print</Chakra.Button>
                    </Chakra.Box>
                    <Chakra.Box w='33%' display='flex' justifyContent='right'>
                        <Chakra.IconButton onClick={onClose} w='1vw' h='2vw' fontSize='1vw' bg='#0000' icon={<SmallCloseIcon />} borderRadius='0' />
                    </Chakra.Box>
                </Chakra.ModalHeader>
                <Chakra.ModalBody w='100%' h='100%' p='1% 0% 2% 2%' display='flex' flexDirection='column' overflow='auto' scrollBehavior='smooth'>
                    <Chakra.Box w='100%' display='flex' alignItems='flex-start' justifyContent='center'>
                        <Chakra.Box w='45%' p='3%' bg='white' display='flex' flexDirection='column' borderRadius='0'>
                            <Chakra.Box w='100%' p='2%' bg='white' borderRadius='0'>
                                <Chakra.Box mb='3%' display='flex'>
                                    <Chakra.Image src={user?.profileImageUrl} w='6vw' h='6vw' borderRadius='0' />
                                    <Chakra.Box ml='2%'>
                                        <Chakra.Text fontSize='1.5vw' fontWeight='700' textTransform='capitalize'>{`${user?.firstName} ${user?.middleName} ${user?.lastName} ${user?.extensionName}`}</Chakra.Text>
                                        <Chakra.Text fontSize='1.2vw' fontWeight='400' textTransform='capitalize'>{`${user?.adviser}`}</Chakra.Text>
                                    </Chakra.Box>
                                </Chakra.Box>
                                <hr />
                                <Chakra.Box mt='2%' ml='1%' mb='1%'>
                                    <Chakra.Text fontSize='.9vw' fontWeight='400' display='flex' alignItems='center' textTransform='capitalize'><Chakra.Text mr='.7%'><HiPhone /></Chakra.Text>{`: ${user?.contactNumber}`}</Chakra.Text>
                                    <Chakra.Text fontSize='.9vw' fontWeight='400' display='flex' alignItems='center' textTransform='capitalize'><Chakra.Text mr='.7%'><HiMiniMapPin /></Chakra.Text>{`: ${user?.address}`}</Chakra.Text>
                                    <Chakra.Text fontSize='.9vw' fontWeight='400' display='flex' alignItems='center'><Chakra.Text mr='.7%'><HiEnvelope /></Chakra.Text>{`: ${user?.emailAddress}`}</Chakra.Text>
                                </Chakra.Box>
                            </Chakra.Box>

                            <Chakra.Box mt='3%' p='2%'>
                                <Chakra.Text fontSize='1vw' fontWeight='700'>PERSONAL INFORMATION</Chakra.Text>
                                <Chakra.Box h='.1vw' bg='gray.500'></Chakra.Box>

                                <Chakra.Box w='100%' p='2%'>
                                    <Chakra.Box w='100%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Age:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.age}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Birthdate:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{new Date(user?.birthdate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Birthplace:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.birthplace}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Gender:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.gender}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Civil Status:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.civilStatus}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Citizenship:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.citizenship}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                </Chakra.Box>
                            </Chakra.Box>

                            <Chakra.Box mt='.1%' p='2%'>
                                <Chakra.Text fontSize='1vw' fontWeight='700'>JOB INFORMATION</Chakra.Text>
                                <Chakra.Box h='.1vw' bg='gray.500'></Chakra.Box>

                                <Chakra.Box w='100%' p='2%'>
                                    <Chakra.Box w='100%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Ehris No. :</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.ehrisNo}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>employee ID:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.employeeId}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Position:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.position}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Active:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.active}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Application Status:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.applicationStatus}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Status of Employment:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.statusOfEmployment}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Item Number:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.itemNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Old Item Number:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.oldItemNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Original Date as Permanent:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{new Date(user?.originalDateAsPermanent).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Date of original Applointment:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{new Date(user?.dateOfOriginalAppointment).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Date of Last Promotion:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{new Date(user?.dateOfLastPromotion).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Remarks Status:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.remarksStatus}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                </Chakra.Box>
                            </Chakra.Box>

                            <Chakra.Box mt='.1%' p='2%'>
                                <Chakra.Text fontSize='1vw' fontWeight='700'>IDs</Chakra.Text>
                                <Chakra.Box h='.1vw' bg='gray.500'></Chakra.Box>

                                <Chakra.Box w='100%' p='2%'>
                                    <Chakra.Box w='100%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>TIN Number:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.tinNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>SSS Number:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.sssNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>PhilHealth Number:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.philhealth}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>GSIS Number:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.gsisNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Pag-ibig Number:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.pagibigNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>PRC Number:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{`${user?.prcNumber} (Expiratopn date: ${user?.prcExpirationDate})`}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                </Chakra.Box>
                            </Chakra.Box>

                            <Chakra.Box mt='.1%' p='2%'>
                                <Chakra.Text fontSize='1vw' fontWeight='700'>OTHERS</Chakra.Text>
                                <Chakra.Box h='.1vw' bg='gray.500'></Chakra.Box>

                                <Chakra.Box w='100%' p='2%'>
                                    <Chakra.Box w='100%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Adviser:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.adviser}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>CS Eligibility:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.csEligibility !== 'Others' ? `${user?.csEligibility}` : `${user?.otherCsEligibility}`}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Educational Attainment:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.educationalAttainment}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Plantilla Item No. :</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400'>{user?.plantillaItemNo}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>First day of Service of Current Status:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{new Date(user?.firstDayOfService).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Teaching Experience:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{teachingExperience}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%' display='flex'>
                                        <Chakra.Text w='47%' fontSize='.9vw' fontWeight='500'>Basic Salary:</Chakra.Text>
                                        <Chakra.Text w='53%' fontSize='.9vw' fontWeight='400' textTransform='capitalize'>{user?.basicSalary}</Chakra.Text>
                                    </Chakra.Box>
                                    <hr />
                                </Chakra.Box>
                            </Chakra.Box>

                        </Chakra.Box>

                        <Chakra.Box w='55%' p='0% 2% 2% 2%'>
                            <Chakra.Box w='100%' p='5%' bg='white' borderRadius='0'>
                                <Chakra.Box display='flex' alignItems='center' justifyContent='space-between'>
                                    <Chakra.Text fontSize='1.2vw' fontWeight='bold'>Trainings</Chakra.Text>
                                    <Chakra.Box display='flex'>
                                        <Chakra.Button onClick={handleSaveCSV} mr='2%' h='1.6vw' fontSize='.9vw' bg='teal' color='white' borderRadius='0' _hover={{ border: '.1vw solid teal', bg: 'white', color: 'teal' }} leftIcon={<TiExport />}>export data</Chakra.Button>
                                        <Chakra.Button onClick={handleSaveAsPDF} mr='2%' h='1.6vw' fontSize='.9vw' bg='teal' color='white' borderRadius='0' _hover={{ border: '.1vw solid teal', bg: 'white', color: 'teal' }} leftIcon={<TiDownload />}>save as pdf</Chakra.Button>
                                        <Chakra.Button onClick={handleCertificatePrint} isLoading={loading} h='1.6vw' fontSize='.9vw' colorScheme='blue' borderRadius='0' _hover={{ border: '.1vw solid blue', bg: 'white', color: 'blue' }} leftIcon={<BiPrinter />}>print table</Chakra.Button>
                                    </Chakra.Box>
                                </Chakra.Box>
                                <Chakra.Text mb='1%' fontSize='.8vw' fontStyle='italic' color='gray.500'>Click on a certificate to view its details</Chakra.Text>
                                <hr />
                                <ThemeProvider theme={theme}>
                                    <MaterialReactTable
                                        columns={columns}
                                        data={certificates}
                                        muiTableHeadCellProps={{ sx: { fontSize: '.8vw' } }}
                                        muiTableBodyCellProps={{ sx: { fontSize: '.8vw', cursor: 'pointer' } }}
                                        enablePagination={false}
                                        enableStickyFooter={true}
                                        enableColumnFilters={true}
                                        initialState={{ density: 'compact' }}
                                        muiTableBodyRowProps={({ row }) => ({
                                            onClick: () => handleRowClick(row)
                                        })}
                                    />
                                </ThemeProvider>
                            </Chakra.Box>
                        </Chakra.Box>
                    </Chakra.Box>
                    <Chakra.Box w='100%'></Chakra.Box>

                    {/* User Data Printable layout */}
                    <Chakra.Box hidden>
                        <Chakra.Box ref={contentRef} w='816px' margin='2% auto 0 auto' userSelect='none' color='gray.800'>
                            <Chakra.Box w='100%'>
                                <Chakra.Box w='100%' display='flex'>
                                    <Chakra.Image w='140px' h='140px' src={user?.profileImageUrl} border='1px solid gray' />
                                    <Chakra.Box w='100%' ml='30px'>
                                        <Chakra.Text fontSize='18px' fontWeight='bold' textTransform='capitalize'>{`${user?.firstName} ${user?.middleName} ${user?.lastName} ${user?.extensionName}`}</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{`${user?.adviser}`}</Chakra.Text>

                                        <Chakra.Text mt='17px' fontSize='14px' fontWeight='400' display='flex' alignItems='center'><Chakra.Text mr='1%' fontWeight='500' display='flex'><HiPhone /></Chakra.Text>: {user?.contactNumber}</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400' display='flex' alignItems='center' textTransform='capitalize'><Chakra.Text mr='1%' fontWeight='500' display='flex'><HiMiniMapPin /></Chakra.Text>: {user?.address}</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400' display='flex' alignItems='center'><Chakra.Text mr='1%' fontWeight='500' display='flex'><HiEnvelope /></Chakra.Text>: {user?.emailAddress}</Chakra.Text>
                                    </Chakra.Box>
                                </Chakra.Box>

                                <Chakra.Text mt='60px' fontSize='14px' fontWeight='700'>PERSONAL INFORMATION</Chakra.Text>
                                <Chakra.Box w='100%' h='2px' bg='gray.800'></Chakra.Box>

                                <Chakra.Box w='100%' p='0 2% 0 2%'>
                                    <Chakra.Box w='100%' mt='10px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Age:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{user?.age}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Birthdate:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{new Date(user?.birthdate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Birthplace:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{user?.birthplace}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Gender:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{user?.gender}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Civil Status:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{user?.civilStatus}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Citizenship:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{user?.citizenship}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                </Chakra.Box>

                                <Chakra.Text mt='60px' fontSize='14px' fontWeight='700'>JOB INFORMATION</Chakra.Text>
                                <Chakra.Box w='100%' h='2px' bg='gray.800'></Chakra.Box>

                                <Chakra.Box w='100%' p='0 2% 0 2%'>
                                    <Chakra.Box w='100%' mt='10px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Ehris No. :</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{user?.ehrisNo}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Employee ID:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{user?.employeeId}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Position:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{user?.position}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Active:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{user?.active}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Application Status:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{user?.applicationStatus}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Status of Employment:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{user?.statusOfEmployment}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Item Number:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{user?.itemNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Old Item Number:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{user?.oldItemNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Original date as Permanent:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{new Date(user?.originalDateAsPermanent).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Date of original Appointment:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{new Date(user?.dateOfOriginalAppointment).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Date of Last Promotion:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{new Date(user?.dateOfLastPromotion).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Remarks Status:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{user?.remarksStatus}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                </Chakra.Box>

                                <Chakra.Text mt='60px' fontSize='14px' fontWeight='700'>IDs</Chakra.Text>
                                <Chakra.Box w='100%' h='2px' bg='gray.800'></Chakra.Box>

                                <Chakra.Box w='100%' p='0 2% 0 2%'>
                                    <Chakra.Box w='100%' mt='10px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>TIN Number:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{user?.tinNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>SSS Number:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{user?.sssNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>PhilHealth Number:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{user?.philhealth}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>GSIS Number:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{user?.gsisNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Pag-ibig Number:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{user?.pagibigNumber}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>PRC Number:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{`${user?.prcNumber} (Expiration date: ${user?.prcExpirationDate})`}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                </Chakra.Box>

                                <Chakra.Text mt='60px' fontSize='14px' fontWeight='700'>OTHERS</Chakra.Text>
                                <Chakra.Box w='100%' h='2px' bg='gray.800'></Chakra.Box>

                                <Chakra.Box w='100%' p='0 2% 0 2%'>
                                    <Chakra.Box w='100%' mt='10px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Adviser:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{user?.adviser}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>CS Eligibility:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{user?.csEligibility === 'Others' ? `${user.otherEligibility}` : user?.csEligibility}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Educational Attainment:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{user?.educationalAttainment}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Plantilla Item No. :</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{user?.plantillaNo}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>First day of Service of Current Station:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{new Date(user?.firstDayOfService).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Teaching Experience:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{teachingExperience}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                    <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                        <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Basic Salary:</Chakra.Text>
                                        <Chakra.Text fontSize='14px' fontWeight='400'>{user?.basicSalary}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                </Chakra.Box>

                                <Chakra.Text mt='60px' fontSize='14px' fontWeight='700'>TRAININGS</Chakra.Text>
                                <Chakra.Box w='100%' h='2px' bg='gray.800'></Chakra.Box>

                                {certificates.length === 0 ? (
                                    <Chakra.Box w='100%' mb='4.5%' p='0 2% 0 2%'>
                                        <Chakra.Box w='100%' mt='10px' p='0 2% 0 2%' display='flex'>
                                            <Chakra.Text w='100%' fontSize='14px' color='gray.500' fontWeight='400' textTransform='capitalize' textAlign='center'>N/A</Chakra.Text>
                                        </Chakra.Box>
                                    </Chakra.Box>
                                )
                                    :
                                    (
                                        certificates.map((certificate) => (
                                            <Chakra.Box key={certificate.id} w='100%' mb='4.5%' p='0 2% 0 2%'>
                                                <Chakra.Box w='100%' mt='10px' p='0 2% 0 2%' display='flex'>
                                                    <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Title</Chakra.Text>
                                                    <Chakra.Text fontSize='14px' fontWeight='400' textTransform='capitalize'>{certificate.title}</Chakra.Text>
                                                </Chakra.Box>
                                                <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                                <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                                    <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Venue:</Chakra.Text>
                                                    <Chakra.Text fontSize='14px' textTransform='capitalize'>{certificate.venue}</Chakra.Text>
                                                </Chakra.Box>
                                                <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                                <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                                    <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Sponsoring Agency:</Chakra.Text>
                                                    <Chakra.Text fontSize='14px' textTransform='capitalize'>{certificate.sponsoringAgency}</Chakra.Text>
                                                </Chakra.Box>
                                                <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                                <Chakra.Box w='100%' mt='5px' p='0 2% 0 2%' display='flex'>
                                                    <Chakra.Text w='45%' fontSize='14px' fontWeight='500'>Date:</Chakra.Text>
                                                    <Chakra.Text fontSize='14px'>{new Date(certificate.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                                                </Chakra.Box>
                                                <Chakra.Box h='1px' bg='gray.300'></Chakra.Box>
                                            </Chakra.Box>
                                        ))
                                    )}
                            </Chakra.Box>
                        </Chakra.Box>
                    </Chakra.Box>

                    {/* Certificate Printable Layout */}
                    <Chakra.Box hidden>
                        <Chakra.Box ref={certificateContentRef} w='100%' mt='2%' mb='2%'>
                            <Chakra.Text mb='.7%' textAlign='center' fontSize='20px' fontWeight='700' color='gray.700'>Certificates</Chakra.Text>
                            <Chakra.Box w='100%' h='1px' bg='gray.300'></Chakra.Box>
                            <Chakra.Box mt='5%' mb='1%' display='flex'>
                                <Chakra.Text fontSize='16px' color='black' textTransform='capitalize'>Name:</Chakra.Text>
                                <Chakra.Text fontSize='16px' ml='1%' fontWeight='500' color='black' textTransform='capitalize'>{`${user?.firstName} ${user?.middleName} ${user?.lastName} ${user?.extensionName}`}</Chakra.Text>
                            </Chakra.Box>
                            <table style={{ width: '100%', border: '1px solid gray', borderCollapse: 'collapse' }}>
                                <thead style={{ width: '100%', backgroundColor: 'lightgray' }}>
                                    <tr>
                                        <th style={{ width: '30%', color: 'black', padding: '1.5%', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', border: '1px solid gray' }}>Title</th>
                                        <th style={{ width: '20%', color: 'black', padding: '1.5%', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', border: '1px solid gray' }}>Venue</th>
                                        <th style={{ width: '30%', color: 'black', padding: '1.5%', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', border: '1px solid gray' }}>Sponsoring Agency</th>
                                        <th style={{ width: '20%', color: 'black', padding: '1.5%', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', border: '1px solid gray' }}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loading && certificates.length > 0 ? (
                                        certificates.map((certificate) => (
                                            <tr key={certificate.id}>
                                                <td style={{ width: '30%', color: 'black', padding: '1% 1% 1% 2%', fontSize: '13px', border: '1px solid gray', textTransform: 'capitalize' }}>{certificate.title}</td>
                                                <td style={{ width: '20%', color: 'black', padding: '1% 1% 1% 2%', fontSize: '13px', border: '1px solid gray', textTransform: 'capitalize' }}>{certificate.venue}</td>
                                                <td style={{ width: '30%', color: 'black', padding: '1% 1% 1% 2%', fontSize: '13px', border: '1px solid gray', textTransform: 'capitalize' }}>{certificate.sponsoringAgency}</td>
                                                <td style={{ width: '25%', color: 'black', padding: '1% 1% 1% 2%', fontSize: '13px', border: '1px solid gray', textTransform: 'capitalize' }}>{new Date(certificate.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || 'N/A'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '8px', border: '1px solid gray' }}>
                                                {loading ? 'Loading...' : 'No certificates found.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Chakra.Box>
                    </Chakra.Box>
                </Chakra.ModalBody>

                <ViewCertificate isOpen={isOpenUserCertificate} onClose={onCloseUserCertificate} certificate={selectedCertificate} userType={userType} />
            </Chakra.ModalContent>
        </Chakra.Modal>
    )
}
