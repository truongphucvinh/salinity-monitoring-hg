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
                            { newsContent?.postTitle }
                        </div>
                        <div className="news__publishcation-date">
                            { newsContent?.postCreatedAt }
                        </div>
                        <div className="news__content" dangerouslySetInnerHTML={{__html: newsContent?.postContent}}></div>
                        <div className="news__author">
                            { newsContent?.postCreatorName }
                        </div>
                    </div>
                </CCard>
            </CCol>
            <CCol xs={0} md={2}></CCol>
        </CRow>
    </>
}

export default News