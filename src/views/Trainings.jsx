/* eslint-disable react/prop-types */
import React from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as Chakra from '@chakra-ui/react'
import { Helmet } from 'react-helmet'
import { useReactToPrint } from 'react-to-print'
import { TiRefresh, TiDownload, TiPlus } from "react-icons/ti"
import { BiSolidPrinter, BiSolidFolder } from "react-icons/bi"
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { MaterialReactTable } from 'material-react-table'
import { saveCSV } from '../utils/xlsx/SaveCSV'
import AddCertificate from '../components/modal/AddCertificate'
import ViewCertificate from '../components/modal/ViewCertificate'
import SchoolLogo from '../assets/tes_logo.png'

export default function Trainings({ certificates, loadingCertificates, refreshCertificates }) {

  const { isOpen: isOpenCertificateForm, onOpen: onOpenCertificateForm, onClose: onCloseCertificateForm } = Chakra.useDisclosure()
  const { isOpen: isOpenCertificate, onOpen: onOpenCertificate, onClose: onCloseCertificate } = Chakra.useDisclosure()
  const [selectedCertificate, setSelectedCertificate] = React.useState(null)
  const contentRef = React.useRef(null)
  const [printing, setPrinting] = React.useState(false)

  const handleCardClick = (certificate) => {
    setSelectedCertificate(certificate)
    onOpenCertificate()
  }

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
      },
      {
        accessorKey: 'venue',
        header: 'Venue',
      },
      {
        accessorKey: 'sponsoringAgency',
        header: 'Sponsoring Agency',
      },
      {
        accessorKey: 'date',
        header: 'Date',
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      },
    ],
    []
  )

  const theme = createTheme({
    shadows: [
      'none',
      '0px rgba(0, 0, 0), 0px rgba(0, 0, 0), 0px rgba(0, 0, 0)',
      '0px rgba(0, 0, 0), 0px rgba(0, 0, 0), 0px rgba(0, 0, 0)',
    ]
  })

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

  const handleSaveCSV = () => {
    saveCSV(certificates, columns, `certificates`)
  }

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
    onBeforeGetContent: () => setPrinting(true),
    onAfterPrint: () => setPrinting(false)
  })

  return (
    <Chakra.Box w='100%' h='100%'>
      <Helmet>
        <title>Trainings - Tagongon Elementary School Profiling System</title>
        <meta name="description" content="View and manage your training certificates and professional development records in the Tagongon Elementary School Profiling System." />
        <link rel="icon" type="image/svg+xml" href="/tes_logo.png" />
      </Helmet>
      <Chakra.Tabs w='100%' h='100%'>
        <Chakra.TabList w='100%' h='7%' p='1% 1% .1% 1%' bg='white' display='flex' justifyContent='space-between'>
          <Chakra.Box w='50%' display='flex'>
            <Chakra.Tab fontSize='.9vw' fontWeight='500' color='gray.600'>Card View</Chakra.Tab>
            <Chakra.Tab fontSize='.9vw' fontWeight='500' color='gray.600'>Table View</Chakra.Tab>
          </Chakra.Box>
          <Chakra.Box w='50%' display='flex' alignItems='center' justifyContent='right'>
            <Chakra.Tooltip label='Refresh' fontSize='.9vw'>
              <Chakra.IconButton onClick={refreshCertificates} h='1.7vw' fontSize='1.3vw' colorScheme='blue' icon={<TiRefresh />} borderRadius='0' />
            </Chakra.Tooltip>
            <Chakra.Tooltip label='Add certificate' fontSize='.9vw'>
              <Chakra.IconButton onClick={onOpenCertificateForm} ml='1%' h='1.7vw' fontSize='1vw' colorScheme='blue' icon={<TiPlus />} borderRadius='0' />
            </Chakra.Tooltip>
            <Chakra.Tooltip label='Print certificate' fontSize='.9vw'>
              <Chakra.IconButton onClick={handlePrint} isLoading={printing} isDisable={printing} ml='1%' h='1.7vw' fontSize='.8vw' colorScheme='blue' icon={<BiSolidPrinter />} borderRadius='0' />
            </Chakra.Tooltip>
            <Chakra.Button onClick={handleSaveAsPDF} ml='1%' h='1.7vw' fontSize='.8vw' colorScheme='teal' leftIcon={<TiDownload size='.9vw' />} borderRadius='0'>Save as PDF</Chakra.Button>
            <Chakra.Button onClick={handleSaveCSV} ml='1%' h='1.7vw' fontSize='.8vw' colorScheme='teal' leftIcon={<TiDownload size='.9vw' />} borderRadius='0'>Save as CSV</Chakra.Button>
          </Chakra.Box>
        </Chakra.TabList>

        <Chakra.TabPanels w='100%' h='93%' overflow='auto'>
          <Chakra.TabPanel w='100%' display='flex' flexWrap='wrap'>
            {loadingCertificates ? (
              <Chakra.Box w='100%' display='flex' alignItems='center' justifyContent='center'>
                <Chakra.Spinner w='1vw' h='1vw' color='gray.500' />
                <Chakra.Text ml='1%' fontSize='.9vw' fontWeight='bold' fontStyle='italic' color='gray.500'>Fetching data...</Chakra.Text>
              </Chakra.Box>
            ) : certificates.length === 0 ? (
              <Chakra.Box w='100%' display='flex' alignItems='center' justifyContent='center'>
                <Chakra.Text fontSize='.9vw' fontWeight='bold' fontStyle='italic' color='gray.500'>
                  No certificates found.
                </Chakra.Text>
              </Chakra.Box>
            ) : (
              <>
                {certificates.map((certificate) => (
                  <Chakra.Card onClick={() => handleCardClick(certificate)} key={certificate.id} w='19%' m='.5%' borderRadius='0' boxShadow='none' border='.1vw solid #f0f1f5' cursor='pointer' _hover={{ boxShadow: '.3vw .3vw .3vw rgb(105, 126, 116, .3)', bg: '#fbfbfc', transition: '.3s' }} transition='.3s'>
                    <Chakra.Box w='100%' p='5% 5% 1% 5%' display='flex' justifyContent='space-between'>
                      <Chakra.Icon as={BiSolidFolder} />
                      <Chakra.Text fontSize='.8vw' fontWeight='500' fontStyle='italic' color='gray.600'>{certificate.date}</Chakra.Text>
                    </Chakra.Box>
                    <hr />
                    <Chakra.Box w='100%' mt='5%' p='0 5% 0 5%'>
                      <Chakra.Text fontSize='1vw' fontWeight='700' color='gray.700' textTransform='capitalize' isTruncated>{certificate.title}</Chakra.Text>
                      <Chakra.Text mt='2%' fontSize='.9vw' fontWeight='400' color='gray.700' textTransform='capitalize' isTruncated>Venue: {certificate.venue}</Chakra.Text>
                      <Chakra.Text fontSize='.9vw' fontWeight='400' color='gray.700' textTransform='capitalize' isTruncated>Sponsoring Agency: {certificate.sponsoringAgency}</Chakra.Text>
                    </Chakra.Box>
                    <Chakra.Box w='100%' mt='5%' p='0 5% 5% 5%'>
                      <Chakra.Image w='100%' h='10vw' bg='gray.100' objectFit='contain' src={certificate.imageUrl || SchoolLogo} alt='certificate image' />
                    </Chakra.Box>
                  </Chakra.Card>
                ))}
              </>
            )}
          </Chakra.TabPanel>
          <Chakra.TabPanel w='100%' bg='white'>
            {loadingCertificates ? (
              <Chakra.Box w='100%' display='flex' alignItems='center' justifyContent='center'>
                <Chakra.Spinner w='1vw' h='1vw' color='gray.500' />
                <Chakra.Text ml='1%' fontSize='.9vw' fontWeight='bold' fontStyle='italic' color='gray.500'>Fetching data...</Chakra.Text>
              </Chakra.Box>
            ) : certificates.length === 0 ? (
              <Chakra.Box w='100%' display='flex' alignItems='center' justifyContent='center'>
                <Chakra.Text fontSize='.9vw' fontWeight='bold' fontStyle='italic' color='gray.500'>
                  No certificates found.
                </Chakra.Text>
              </Chakra.Box>
            ) : (
              <>
                <ThemeProvider theme={theme}>
                  <MaterialReactTable
                    columns={columns}
                    data={certificates}
                    muiTableHeadCellProps={{ sx: { fontSize: '.8vw' } }}
                    muiTableBodyCellProps={{ sx: { fontSize: '.8vw', cursor: 'pointer', textTransform: 'capitalize' } }}
                    // enablePagination={false}
                    enableStickyHeader={true}
                    // enableStickyFooter={true}
                    enableRowActions={false}
                    initialState={{ density: 'compact' }}
                    // muiTableContainerProps={{ sx: { height: '32vw' } }}
                    muiTableBodyRowProps={({ row }) => ({
                      onClick: () => {
                        setSelectedCertificate(row.original)
                        onOpenCertificate()
                      }
                    })}
                  />
                </ThemeProvider>
              </>
            )}
          </Chakra.TabPanel>
        </Chakra.TabPanels>
      </Chakra.Tabs>

      <AddCertificate isOpen={isOpenCertificateForm} onClose={onCloseCertificateForm} />
      <ViewCertificate isOpen={isOpenCertificate} onClose={onCloseCertificate} certificate={selectedCertificate} />

      {/* printable layout */}
      <Chakra.Box w='100%' hidden>
        <Chakra.Box ref={contentRef} w='100%'>
          <Chakra.Text mb='.7%' textAlign='center' fontSize='20px' fontWeight='700' color='gray.700'>Certificates</Chakra.Text>
          <Chakra.Box w='100%' h='1px' bg='gray.300'></Chakra.Box>
          {/* <Chakra.Box mt='5%' mb='1%' display='flex'>
          <Chakra.Text fontSize='16px' color='black' textTransform='capitalize'>Name:</Chakra.Text>
          <Chakra.Text fontSize='16px' ml='1%' fontWeight='500' color='black' textTransform='capitalize'>{`${data?.firstName} ${data?.middleName} ${data?.lastName} ${data?.extensionName}`}</Chakra.Text>
        </Chakra.Box> */}
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
              {!loadingCertificates && certificates.length > 0 ? (
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
                    {loadingCertificates ? 'Loading...' : 'No certificates found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Chakra.Box>
      </Chakra.Box>
    </Chakra.Box>
  )
}
