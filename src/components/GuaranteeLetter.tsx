import { forwardRef } from 'react';
import { LetterData, Guest } from '../types';
import { formatLetterDate, formatTableDate } from '../lib/formatDate';

interface GuaranteeLetterProps {
  data: LetterData;
}

export const GuaranteeLetter = forwardRef<HTMLDivElement, GuaranteeLetterProps>(
  ({ data }, ref) => {
    const {
      city,
      date,
      letterNumber,
      subject,
      recipient,
      recipientBranch,
      recipientLocationPrefix,
      recipientLocation,
      salutation,
      statementPreamble,
      guests,
      coverageType,
      coverageSentence,
      billingBlock,
      closingSentence,
      signatoryTitle,
      signatoryName,
      assets,
      showPlaceholdersInPdf,
      repeatHeaderOnPage2,
    } = data;

    // Paginate guests if > 6 guests to prevent overflow and ensure signature block stays intact
    const MAX_GUESTS_PAGE_1_WITH_SIGNATURE = 6;
    const MAX_GUESTS_PAGE_1_SPLIT = 7;
    const MAX_GUESTS_PER_PAGE_SUBSEQUENT = 12;

    const needsPagination = guests.length > MAX_GUESTS_PAGE_1_WITH_SIGNATURE;

    let pages: Guest[][] = [guests];

    if (needsPagination) {
      pages = [];
      // Page 1 gets up to MAX_GUESTS_PAGE_1_SPLIT
      pages.push(guests.slice(0, MAX_GUESTS_PAGE_1_SPLIT));
      let remaining = guests.slice(MAX_GUESTS_PAGE_1_SPLIT);

      while (remaining.length > 0) {
        pages.push(remaining.slice(0, MAX_GUESTS_PER_PAGE_SUBSEQUENT));
        remaining = remaining.slice(MAX_GUESTS_PER_PAGE_SUBSEQUENT);
      }
    }

    const formattedDate = formatLetterDate(date, city);

    return (
      <div ref={ref} className="guarantee-letter-container flex flex-col gap-8 print:gap-0">
        {pages.map((pageGuests, pageIndex) => {
          const isFirstPage = pageIndex === 0;
          const isLastPage = pageIndex === pages.length - 1;
          const startIndex = pages
            .slice(0, pageIndex)
            .reduce((acc, curr) => acc + curr.length, 0);

          return (
            <div
              key={pageIndex}
              data-page={pageIndex + 1}
              className="a4-page relative bg-white text-black font-serif select-text shadow-paper print:shadow-none print:m-0 mx-auto box-border flex flex-col justify-between"
              style={{
                width: '210mm',
                minHeight: '297mm',
                paddingTop: '15mm',
                paddingBottom: '15mm',
                paddingLeft: '20mm',
                paddingRight: '20mm',
                fontSize: '11.5pt',
                lineHeight: 1.25,
                boxSizing: 'border-box',
              }}
            >
              <div>
                {/* 1. LETTERHEAD */}
                {(isFirstPage || repeatHeaderOnPage2) && (
                  <div className="letterhead pb-2 mb-3 border-b-[2px] border-black">
                    <div className="flex justify-between items-center">
                      {/* Left Logo and Title */}
                      <div className="flex items-center gap-3.5">
                        {assets.logoUrl ? (
                          <img
                            src={assets.logoUrl}
                            alt="AirNav Indonesia Logo"
                            className="h-14 w-14 object-contain shrink-0"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            {/* SVG Logo mark */}
                            <div className="w-12 h-12 bg-navy-900 rounded-sm flex items-center justify-center text-white shrink-0">
                              <svg
                                className="w-7 h-7"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <circle cx="12" cy="12" r="9" strokeOpacity="0.4" />
                                <path d="M12 3a9 9 0 0 1 9 9" stroke="white" />
                                <path
                                  d="M12 12l6-4m-6 4l-4 6m4-6l-5-5"
                                  strokeLinecap="round"
                                />
                                <circle cx="12" cy="12" fill="white" r="1.5" />
                              </svg>
                            </div>
                            {showPlaceholdersInPdf && (
                              <div className="text-[10px] font-sans text-gray-500 border border-dashed border-gray-400 px-1 py-0.5 rounded">
                                LOGO
                              </div>
                            )}
                          </div>
                        )}

                        <div
                          className="font-bold tracking-tight text-black leading-none font-serif"
                          style={{ fontSize: '20pt' }}
                        >
                          AirNav Indonesia
                        </div>
                      </div>

                      {/* Right Address Block - left-aligned internally */}
                      <div
                        className="text-left leading-tight font-sans text-black shrink-0"
                        style={{ fontSize: '9.5pt' }}
                      >
                        <div className="font-bold" style={{ fontSize: '11pt' }}>
                          Perum LPPNPI
                        </div>
                        <div className="font-bold">Kantor Cabang Surabaya</div>
                        <div>Gedung AOB - Bandara Juanda,</div>
                        <div>Surabaya - 61253</div>
                        <div>Telp. (031) 2986515</div>
                        <div className="whitespace-nowrap">
                          e-mail :{' '}
                          <span className="text-[#1B4380] underline">
                            surabaya@airnavindonesia.co.id
                          </span>
                        </div>
                        <div>www.airnavindonesia.co.id</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Continued Page Header if page > 1 and repeatHeader is off */}
                {!isFirstPage && !repeatHeaderOnPage2 && (
                  <div className="flex justify-between items-center text-[10pt] font-sans text-gray-600 pb-2 mb-4 border-b border-gray-300">
                    <span>Guarantee Letter - Hal. {pageIndex + 1}</span>
                    <span>Nomor: {letterNumber}</span>
                  </div>
                )}

                {/* 2. DATE LINE & METADATA (Page 1 only) */}
                {isFirstPage && (
                  <>
                    <div className="text-left font-bold my-3 text-black">{formattedDate}</div>

                    <div className="metadata-block space-y-1 mb-4 text-left">
                      <div className="flex">
                        <span className="w-20 font-bold">Nomor</span>
                        <span className="w-4">:</span>
                        <span className="font-normal">{letterNumber || '--'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-20 font-bold">Perihal</span>
                        <span className="w-4">:</span>
                        <span className="font-bold underline">{subject || 'Guarantee Letter'}</span>
                      </div>
                    </div>

                    {/* 3. ADDRESSEE */}
                    <div className="addressee-block mb-4 leading-normal text-left">
                      <div>Kepada Yth. :</div>
                      <div className="font-bold text-black">{recipient}</div>
                      {recipientBranch && (
                        <div className="font-bold uppercase text-black">{recipientBranch}</div>
                      )}
                      <div>{recipientLocationPrefix || 'di –'}</div>
                      <div>{recipientLocation || 'Tempat'}</div>
                    </div>

                    {/* 4. SALUTATION */}
                    <div className="salutation-block mb-3 space-y-1">
                      <div>{salutation || 'Dengan hormat,'}</div>
                      <div>{statementPreamble || 'Dengan ini kami menyatakan bahwa :'}</div>
                    </div>
                  </>
                )}

                {/* 5. GUEST TABLE */}
                <div className="guest-table-wrapper mb-4">
                  <table
                    className="w-full table-fixed border-collapse border border-black text-black"
                    style={{ fontSize: '11pt', lineHeight: '1.2' }}
                  >
                    <colgroup>
                      <col style={{ width: '7%' }} />
                      <col style={{ width: '35%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '19%' }} />
                      <col style={{ width: '19%' }} />
                    </colgroup>
                    <thead>
                      <tr className="bg-white text-center font-bold" style={{ height: '16mm' }}>
                        <th
                          className="border border-black px-1 text-center align-middle"
                          style={{ width: '7%', height: '16mm', fontSize: '11pt' }}
                        >
                          No.
                        </th>
                        <th
                          className="border border-black px-2 text-center align-middle"
                          style={{ width: '35%', height: '16mm', fontSize: '11pt' }}
                        >
                          NAMA
                        </th>
                        <th
                          className="border border-black px-1 text-center align-middle"
                          style={{ width: '20%', height: '16mm', fontSize: '11pt' }}
                        >
                          TYPE
                        </th>
                        <th
                          className="border border-black p-0 text-center align-top"
                          style={{ width: '38%', height: '16mm' }}
                          colSpan={2}
                        >
                          <div
                            className="w-full flex flex-col justify-between"
                            style={{ height: '16mm', minHeight: '16mm' }}
                          >
                            <div
                              className="border-b border-black text-center font-bold flex items-center justify-center tracking-wider"
                              style={{
                                height: '8mm',
                                minHeight: '8mm',
                                fontSize: '11pt',
                                lineHeight: '1.2',
                              }}
                            >
                              <span
                                className="keterangan-title inline-block relative"
                                style={{ top: '-0.4mm' }}
                              >
                                KETERANGAN
                              </span>
                            </div>
                            <div className="flex w-full" style={{ height: '8mm', minHeight: '8mm' }}>
                              <div
                                className="w-1/2 border-r border-black text-center font-bold flex items-center justify-center px-1"
                                style={{
                                  height: '8mm',
                                  minHeight: '8mm',
                                  fontSize: '10.5pt',
                                  lineHeight: '1.2',
                                }}
                              >
                                <span
                                  className="check-in-out-title inline-block relative"
                                  style={{ top: '-0.3mm' }}
                                >
                                  Check In
                                </span>
                              </div>
                              <div
                                className="w-1/2 text-center font-bold flex items-center justify-center px-1"
                                style={{
                                  height: '8mm',
                                  minHeight: '8mm',
                                  fontSize: '10.5pt',
                                  lineHeight: '1.2',
                                }}
                              >
                                <span
                                  className="check-in-out-title inline-block relative"
                                  style={{ top: '-0.3mm' }}
                                >
                                  Check Out
                                </span>
                              </div>
                            </div>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageGuests.map((guest, idx) => {
                        const globalNo = startIndex + idx + 1;
                        let titleFormatted = guest.title || '';
                        if (titleFormatted.toLowerCase().startsWith('mr.')) titleFormatted = 'Mr.';
                        else if (titleFormatted.toLowerCase().startsWith('mrs.')) titleFormatted = 'Mrs.';
                        else if (titleFormatted.toLowerCase().startsWith('ms.')) titleFormatted = 'Mrs.';
                        return (
                          <tr key={guest.id || idx}>
                            <td
                              className="border border-black py-2 px-1 text-center font-bold align-middle"
                              style={{ fontSize: '11pt' }}
                            >
                              {globalNo}
                            </td>
                            <td
                              className="border border-black py-2 px-2.5 font-bold text-left align-middle break-words"
                              style={{ fontSize: '10.5pt', lineHeight: '1.25' }}
                            >
                              {titleFormatted ? `${titleFormatted} ` : ''}
                              <span className="uppercase">{guest.nama || '--'}</span>
                            </td>
                            <td
                              className="border border-black py-2 px-1 text-center uppercase align-middle whitespace-nowrap"
                              style={{ fontSize: '10pt', lineHeight: '1.2' }}
                            >
                              {guest.type || '--'}
                            </td>
                            <td
                              className="border border-black py-2 px-1 text-center align-middle whitespace-nowrap"
                              style={{ fontSize: '10.5pt', lineHeight: '1.2' }}
                            >
                              {formatTableDate(guest.checkIn)}
                            </td>
                            <td
                              className="border border-black py-2 px-1 text-center align-middle whitespace-nowrap"
                              style={{ fontSize: '10.5pt', lineHeight: '1.2' }}
                            >
                              {formatTableDate(guest.checkOut)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 6. COVERAGE, BILLING, AND SIGNATURE (Only on Last Page) */}
                {isLastPage && (
                  <div className="last-page-closing-content space-y-4">
                    {/* Coverage Paragraph (Justified / Rata Kanan-Kiri) */}
                    <div
                      className="coverage-text text-justify leading-relaxed"
                      style={{ textAlign: 'justify', textAlignLast: 'left' }}
                    >
                      {coverageSentence.includes(coverageType) ? (
                        <>
                          {coverageSentence.split(coverageType)[0]}
                          <span className="italic font-bold">{coverageType}</span>
                          {coverageSentence.split(coverageType)[1]}
                        </>
                      ) : (
                        coverageSentence
                      )}
                    </div>

                    {/* Centered Billing Block */}
                    <div
                      className="billing-block text-center font-bold uppercase mx-auto my-3"
                      style={{ fontSize: '11pt', lineHeight: '1.5' }}
                    >
                      {billingBlock.map((line, lIdx) => (
                        <div
                          key={lIdx}
                          className={line.includes('UP.') ? 'font-bold' : ''}
                        >
                          {line}
                        </div>
                      ))}
                    </div>

                    {/* Closing Sentence */}
                    <div className="closing-text">
                      {closingSentence ||
                        'Demikian disampaikan, atas kerja samanya diucapkan terima kasih.'}
                    </div>

                    {/* 7. SIGNATURE BLOCK (Flush left aligned with Demikian, generous vertical breathing room) */}
                    <div
                      className="signature-section relative select-none"
                      style={{
                        marginTop: '13mm',
                        marginLeft: 0,
                        width: '120mm',
                        fontFamily: '"Times New Roman", Times, Tinos, serif',
                      }}
                    >
                      {/* Signatory Title - flush left aligned with Demikian */}
                      <div
                        className="font-bold uppercase tracking-wide leading-tight relative z-10 text-black text-left"
                        style={{ fontSize: '11pt' }}
                      >
                        {signatoryTitle || 'JUNIOR MANAGER PERSONALIA & UMUM'}
                      </div>

                      {/* Official Stamp & Signature Overlay */}
                      {assets.stampUrl ? (
                        <img
                          src={assets.stampUrl}
                          alt="Stempel Resmi Perum LPPNPI & TTD"
                          className="absolute pointer-events-none opacity-95 z-20"
                          style={{
                            top: '-2mm',
                            left: '-16mm',
                            width: '51mm',
                            height: '37.1mm',
                            mixBlendMode: 'multiply',
                          }}
                        />
                      ) : (
                        showPlaceholdersInPdf && (
                          <div
                            className="absolute rounded-full border border-dashed border-gray-400 flex items-center justify-center text-[9px] font-sans text-gray-400 font-bold tracking-wider text-center pointer-events-none"
                            style={{
                              top: '-1mm',
                              left: '-12mm',
                              width: '34mm',
                              height: '34mm',
                            }}
                          >
                            STEMPEL
                          </div>
                        )
                      )}

                      {/* Separate custom signature if uploaded */}
                      {assets.signatureUrl ? (
                        <img
                          src={assets.signatureUrl}
                          alt="Tanda Tangan Pejabat"
                          className="absolute pointer-events-none z-20"
                          style={{
                            top: '10mm',
                            left: '6mm',
                            width: '42mm',
                            height: '22mm',
                            mixBlendMode: 'multiply',
                          }}
                        />
                      ) : (
                        !assets.stampUrl && showPlaceholdersInPdf && (
                          <div
                            className="absolute border border-dashed border-gray-400 flex items-center justify-center text-[9px] font-sans text-gray-400 font-bold tracking-wider pointer-events-none"
                            style={{
                              top: '12mm',
                              left: '8mm',
                              width: '28mm',
                              height: '14mm',
                            }}
                          >
                            TTD
                          </div>
                        )
                      )}

                      {/* Vertical spacer between Title and Name */}
                      <div style={{ height: '24mm' }} />

                      {/* Signatory Name - flush left aligned with Demikian and Title (NO Underline) */}
                      <div
                        className="font-bold uppercase tracking-wider relative z-10 text-black text-left"
                        style={{
                          fontSize: '11.5pt',
                        }}
                      >
                        {signatoryName}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Page Number for Multi-page */}
              {pages.length > 1 && (
                <div className="text-center font-sans text-[9pt] text-gray-500 pt-3 border-t border-gray-200 mt-4">
                  Halaman {pageIndex + 1} dari {pages.length}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

GuaranteeLetter.displayName = 'GuaranteeLetter';
