import { CCard, CCardBody, CCardHeader, CCol, CImage, CRow } from "@coreui/react"
import React, { useEffect, useRef, useState } from "react"
import CustomIntroduction from "src/views/customs/my-introduction"
import koica from "./images/KOICA.jpg"
import ctu from "./images/CTU.png"
import ttkn from "./images/TTKN.jpg"
import myi from "./images/MYI.jpg"

const AboutUs = () => {
    
    const defaultPageCode="U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dms_page_about_us"
    return (<>
        <CustomIntroduction 
            pageCode={defaultPageCode}
            title="GIỚI THIỆU VỀ CHÚNG TÔI"
            content=""
        />
        <CRow className="d-flex">
            <CCol xs={12} md={3} lg={3} className="mb-4">
                <CCard className="h-100 d-flex">
                    <CCardBody className="flex-grow-1">
                        <div className="d-flex justify-content-center">
                            <CImage 
                                src={myi}
                                width={'200px'}
                                height={'auto'}
                                className="d-block mb-4"
                            />
                        </div>
                        Merry Year International (MYI) là một tổ chức phi chính phủ phát triển quốc tế, hỗ trợ các cơ hội tự lập cho những nhóm dân cư dễ bị tổn thương trên toàn thế giới. Được thành lập vào năm 2011 với trụ sở chính tại Seoul, Hàn Quốc, tổ chức đã thành lập các chi nhánh tại Việt Nam, Malawi, Rwanda và Campuchia. Chi nhánh tại Việt Nam được thành lập lần đầu tiên tại Vĩnh Long vào năm 2011 và hiện đang hoạt động tại Vĩnh Long, Cần Thơ và Hậu Giang, cung cấp hỗ trợ sinh kế và các hoạt động ứng phó với biến đổi khí hậu.
                    </CCardBody>
                </CCard>
            </CCol>

            <CCol xs={12} md={3} lg={3} className="mb-4">
                <CCard className="h-100 d-flex">
                <CCardBody className="flex-grow-1">
                        <div className="d-flex justify-content-center">
                            <CImage 
                                src={koica}
                                width={'200px'}
                                height={'auto'}
                                className="d-block mb-4"
                            />
                        </div>
                        Cơ quan Hợp tác Quốc tế Hàn Quốc (KOICA) được thành lập vào tháng 4 năm 1991, là cơ quan chính phủ chuyên trách nguồn vốn viện trợ không hoàn lại (ODA). KOICA thực hiện các dự án nhằm thúc đẩy mối quan hệ hợp tác giữa Hàn Quốc và các quốc gia đối tác, góp phần giảm đói nghèo, cải thiện chất lượng cuộc sống, phát triển bền vững và đóng góp vào lĩnh vực hợp tác phát triển. Mục tiêu của KOICA là đóng góp vào sự phát triển thịnh vượng của nhân loại, thúc đẩy hòa bình thế giới thông qua các dự án hợp tác phát triển với phương châm cùng chung sống và chia sẻ, không bỏ ai lại ở phía sau. Giá trị trọng tâm của KOICA là 5P (People - con người, Peace - hòa bình, Planet - môi trường, Prosperity - thịnh vượng, Partnership - quan hệ đối tác).
                    </CCardBody>
                </CCard>
            </CCol>

            <CCol xs={12} md={3} lg={3} className="mb-4">
                <CCard className="h-100 d-flex">
                    <CCardBody className="flex-grow-1">
                        <div className="d-flex justify-content-center">
                        <CImage 
                            src={ttkn}
                            width={'200px'}
                            height={'auto'}
                            className="d-block mb-4"
                        />
                        </div>

                        Trung tâm Khuyến nông tỉnh Hậu Giang (viết tắt là TKNN Hậu Giang) là đơn vị sự nghiệp công lập trực thuộc Sở Nông nghiệp và Phát triển Nông thôn tỉnh Hậu Giang, có chức năng thực hiện các hoạt động khuyến nông và đào tạo nghề nông nghiệp cho lao động nông thôn (gọi chung là khuyến nông) trên địa bàn tỉnh Hậu Giang.                    
                    </CCardBody>  
                </CCard>
            </CCol>

            <CCol xs={12} md={3} lg={3} className="mb-4">
                <CCard className="h-100 d-flex">
                    <CCardBody className="flex-grow-1">
                        <div className="d-flex justify-content-center">
                            <CImage 
                                src={ctu}
                                width={'200px'}
                                height={'auto'}
                                className="d-block mb-4"
                            />
                        </div>
                        Đại học Cần Thơ (ĐHCT), cơ sở đào tạo đại học và sau đại học trọng điểm của Nhà nước ở ĐBSCL, là trung tâm văn hóa - khoa học kỹ thuật của vùng. Trường đã không ngừng hoàn thiện và phát triển, từ một số ít ngành đào tạo ban đầu, Trường đã củng cố, phát triển thành một trường đa ngành đa lĩnh vực. Nhiệm vụ chính của Trường là đào tạo, nghiên cứu khoa học (NCKH), chuyển giao công nghệ phục vụ phát triển kinh tế - xã hội trong vùng. Song song với công tác đào tạo, ĐHCT đã tham gia tích cực các chương trình NCKH, ứng dụng những thành tựu khoa học kỹ thuật nhằm giải quyết các vấn đề về khoa học, công nghệ, kinh tế, văn hoá và xã hội của vùng. 
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    </>)

}

export default AboutUs