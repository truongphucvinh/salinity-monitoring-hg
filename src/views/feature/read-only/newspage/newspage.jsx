import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CRow, CCol, CCard } from "@coreui/react";
import "./newspage.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

//service
import newsService from "src/services/news-service";

const News = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newsContent, setNewsContent] = useState();

    const handleBackToHomePage = () => {
        navigate('/dashboard');
    }

    useEffect(() => {
        newsService.getNewsById(id)
            .then((res) => {
                setNewsContent(res);
            })
            .catch((error) => {

            })
    }, [])

    return <>
        <CRow>
            <CCol xs={0} md={2}></CCol>
            <CCol xs={12} md={8}>
                <div className="back-btn" onClick={() => {handleBackToHomePage()}}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <span>Trở lại</span>
                </div>
                <CCard className="mb-4" style={{ marginTop: "10px" }}>
                    <div className="news">
                        <div className="news__title">
                            {/* { newsContent?.postTitle } */}
                            Tin tức 1
                        </div>
                        <div className="news__publishcation-date">
                            Thứ 2, 29/05/2024 9:32 (GMT+7)
                        </div>
                        <div className="news__content"> 
                            {/* dangerouslySetInnerHTML={{__html: newsContent?.postContent}} */}
                            Gần 21.000 xe đạp cải tiến, mỗi chiếc chở 200-300 kg, đã góp phần giải quyết bài toán vận tải quân lương, vũ khí cho chiến dịch Điện Biên Phủ.
                            Ngày 6/12/1953, Bộ Chính trị quyết định mở chiến dịch tổng tiến công vào pháo đài bất khả xâm phạm của quân Pháp ở Điện Biên Phủ. Theo tính toán của Bộ Tổng tham mưu Quân đội nhân dân Việt Nam cùng Tổng cục Cung cấp, để phục vụ hơn 87.000 người ở tuyến đầu (54.000 bộ đội và 33.000 dân công) cần huy động ít nhất 16.000 tấn gạo (chưa kể gạo cho dân công), 100 tấn thịt, 100 tấn rau, 80 tấn muối và khoảng 12 tấn đường...      
                        </div>
                        <div className="news__author">
                            {/* { newsContent?.postCreatorName } */}
                            Tác giả
                        </div>
                    </div>

                    {/* <div className="all-news">
                        <div className="all-news__header">
                            <div className="all-news__title">
                                Tin tức
                            </div>
                        </div>
                        <div className="all-news__list">
                            <div className="virtual">
                                <div className="all-news__list__item">
                                    <div className="all-news__list__item__image">
                                        <img src="https://vcdn1-dulich.vnecdn.net/2022/04/01/MaPiLengHaGiangVnExpress-16488-3513-7729-1648806038.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=lFRvWQkOmXNG_PtKd7ylvw" alt="image error" />
                                    </div>
                                    <div className="all-news__list__item__info">
                                        <div className="all-news__list__item__info__title">Tin tức</div>
                                        <div className="all-news__list__item__info__brief">Tóm tắt tin tức 1</div>
                                    </div>
                                </div>
                                <div className="all-news__list__item">
                                    <div className="all-news__list__item__image">
                                        <img src="https://vcdn1-dulich.vnecdn.net/2022/04/01/MaPiLengHaGiangVnExpress-16488-3513-7729-1648806038.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=lFRvWQkOmXNG_PtKd7ylvw" alt="image error" />
                                    </div>
                                    <div className="all-news__list__item__info">
                                        <div className="all-news__list__item__info__title">Tin tức</div>
                                        <div className="all-news__list__item__info__brief">Tóm tắt tin tức 1</div>
                                    </div>
                                </div>
                                <div className="all-news__list__item">
                                    <div className="all-news__list__item__image">
                                        <img src="https://vcdn1-dulich.vnecdn.net/2022/04/01/MaPiLengHaGiangVnExpress-16488-3513-7729-1648806038.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=lFRvWQkOmXNG_PtKd7ylvw" alt="image error" />
                                    </div>
                                    <div className="all-news__list__item__info">
                                        <div className="all-news__list__item__info__title">Tin tức</div>
                                        <div className="all-news__list__item__info__brief">Tóm tắt tin tức 1</div>
                                    </div>
                                </div>
                                <div className="all-news__list__item">
                                    <div className="all-news__list__item__image">
                                        <img src="https://vcdn1-dulich.vnecdn.net/2022/04/01/MaPiLengHaGiangVnExpress-16488-3513-7729-1648806038.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=lFRvWQkOmXNG_PtKd7ylvw" alt="image error" />
                                    </div>
                                    <div className="all-news__list__item__info">
                                        <div className="all-news__list__item__info__title">Tin tức</div>
                                        <div className="all-news__list__item__info__brief">Tóm tắt tin tức 1</div>
                                    </div>
                                </div>
                                <div className="all-news__list__item">
                                    <div className="all-news__list__item__image">
                                        <img src="https://vcdn1-dulich.vnecdn.net/2022/04/01/MaPiLengHaGiangVnExpress-16488-3513-7729-1648806038.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=lFRvWQkOmXNG_PtKd7ylvw" alt="image error" />
                                    </div>
                                    <div className="all-news__list__item__info">
                                        <div className="all-news__list__item__info__title">Tin tức</div>
                                        <div className="all-news__list__item__info__brief">Tóm tắt tin tức 1</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </CCard>
            </CCol>
            <CCol xs={0} md={2}></CCol>
        </CRow>
    </>
}

export default News