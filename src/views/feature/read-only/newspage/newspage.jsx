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

    const [newsList, setNewsList] = useState([
        // {
        //     postId: 1,
        //     postTitle: "Xâm nhập mặn tại đồng bằng sông Cửu Long duy trì mức cao",
        //     postContent: "Theo nhận định của Trung tâm Dự báo khí tượng thủy văn quốc gia, từ ngày 1-10/5, khu vực miền Tây Nam Bộ phổ biến ít mưa; ngày nắng nóng, có nơi nắng nóng gay gắt. Tuy mưa không nhiều nhưng cần chú ý có thể xuất hiện mưa dông nhiệt cục bộ vào chiều tối dễ kèm theo lốc, sét và gió giật mạnh nguy hiểm. Nhiệt độ cao nhất tại miền Tây Nam Bộ phổ biến từ 34-37 độ C, có nơi cao hơn. Mực nước trên sông Tiền và sông Hậu thời kỳ này biến đổi chậm theo triều. Mực nước cao nhất tuần tại Tân Châu là 1,10m, tại Châu Đốc 1,30m, ở mức tương đương và cao hơn trung bình nhiều năm cùng kỳ khoảng 0,05m.",
        //     postAvatar: "https://image.nhandan.vn/w800/Uploaded/2024/huounvj/2024_05_01/man-2264.jpg.webp",
        //     postCreatorName: "Nguyễn Văn A",
        //     postCreatedAt: "Thứ 5, 02/05/2024 9:32 (GMT+7)"
        // },
        // {
        //     postId: 2,
        //     postTitle: "Hồ Dầu Tiếng tiếp cứu nước ngọt cho Nam Bộ",
        //     postContent: "Những ngày này, hồ Dầu Tiếng, hồ thuỷ lợi lớn nhất Đông Nam Á với trữ lượng nước ngọt lên đến 1,5 tỷ mét khối vẫn ngày đêm “xuôi dòng” tiếp cứu nguồn nước ngọt cho các tỉnh miền nam, phục vụ tưới tiêu cho sản xuất nông nghiệp ở: Tây Ninh, Bình Dương, Thành phố Hồ Chí Minh và Long An. Hạn hán và xâm nhập mặn đang ở mức báo động. Các địa phương ở Nam Bộ như giải toả “cơn khát” khi tiếp cận nguồn nước từ thượng nguồn hồ Dầu Tiếng, qua đó giúp nhân dân ổn định hoạt động sản xuất nông nghiệp và sinh hoạt hằng ngày.",
        //     postAvatar: "https://image.nhandan.vn/w790/Uploaded/2024/wpgfbfjstpy/2024_04_26/anh-1-chon-532.jpg.webp",
        //     postCreatorName: "Nguyễn Hiền",
        //     postCreatedAt: "Thứ 4, 01/05/2024 8:05 (GMT+7)"
        // },
        // {
        //     postId: 3,
        //     postTitle: "Phòng chống hạn, mặn cho cây trồng",
        //     postContent: "Những tháng qua, nắng nóng kéo dài, hạn hán, thiếu nước, xâm nhập mặn xảy ra ở nhiều địa phương trên cả nước. Hàng trăm hồ chứa thủy lợi nhỏ cạn nước, hàng chục nghìn ha cây trồng bị ảnh hưởng, nhất là khu vực miền trung, Tây Nguyên và Đồng bằng sông Cửu Long. Cục Thủy lợi (Bộ Nông nghiệp và Phát triển nông thôn) cho biết, đến giữa tháng 4, các hồ chứa thủy lợi khu vực Bắc Bộ đạt 57% dung tích thiết kế, Bắc Trung Bộ đạt 59%, Nam Trung Bộ đạt 66%, Đông Nam Bộ đạt 56%, đặc biệt khu vực Tây Nguyên chỉ đạt 40% dung tích thiết kế, trong đó Kon Tum 43%, Gia Lai 37%, Đắk Lắk 38%, Đắk Nông 40%, Lâm Đồng 54%. Cũng qua thống kê, khoảng 182 hồ chứa nhỏ bị cạn nước ảnh hưởng đến phục vụ sản xuất nông nghiệp. Hạn hán, xâm nhập mặn, thiếu nước làm gần 10.300 ha cây trồng ở các địa phương: Bình Thuận, Bình Phước, Gia Lai, Kon Tum, Sóc Trăng bị ảnh hưởng. Khu vực Tây Nguyên là nơi có hàng triệu héc-ta cây công nghiệp như: Cà-phê, hồ tiêu, điều, mắc-ca…",
        //     postAvatar: "https://image.nhandan.vn/w800/Uploaded/2024/hutmhz/2024_04_23/han-man-6712.jpg.webp",
        //     postCreatorName: "Cao Văn",
        //     postCreatedAt: "Thứ 6, 26/04/2024 9:32 (GMT+7)"
        // },
        // {
        //     postId: 4,
        //     postTitle: "Cung cấp đủ nước sinh hoạt cho người dân vùng hạn, mặn",
        //     postContent: "Trung tâm dự báo Khí tượng-Thủy văn quốc gia nhận định, năm 2024, xâm nhập mặn tại các tỉnh Đồng bằng sông Cửu Long sẽ cao hơn, phức tạp hơn so với trung bình nhiều năm; mặn tiến sâu hơn bên trong các hệ thống sông. Để bảo đảm đời sống, sản xuất của người dân trong vùng hạn, mặn, thời gian qua, hàng loạt giải pháp đã được các địa phương triển khai như bảo vệ lúa an toàn, cấp nước sạch cho người dân, vận hành hệ thống cống linh hoạt ngăn mặn…Theo Đài Khí tượng-Thủy văn khu vực Nam Bộ, tại Đồng bằng sông Cửu Long, xâm nhập mặn mùa khô năm 2023-2024 ở mức sớm và sâu hơn trung bình nhiều năm, vào sâu hơn bên trong các hệ thống sông. Tính từ đầu mùa khô đến nay, đợt xâm nhập sâu nhất xuất hiện, với ranh mặn 4‰, tiến sâu vào đất liền 40-66 km, có nơi sâu hơn, ranh mặn 1‰ tại hai tỉnh Tiền Giang và Bến Tre vào sâu 70-76 km tùy theo sông. Đến thời điểm hiện tại, mức độ xâm nhập mặn các tỉnh Sóc Trăng, Long An, Trà Vinh, Tiền Giang... mặn phổ biến vẫn cao hơn so với trung bình nhiều năm, xấp xỉ so với năm 2016. Đáng chú ý, tại tỉnh Bến Tre, xâm nhập mặn ở mức xấp xỉ ranh mặn sâu nhất năm 2016, xâm nhập mặn trên sông Cổ Chiên đã sâu hơn ranh mặn sâu nhất năm 2016. Trong khi đó, dự báo tổng lượng mưa tháng 4 và 5 thấp hơn so với trung bình nhiều năm, nguồn nước từ sông Mê Công chảy về Đồng bằng sông Cửu Long vẫn thiếu hụt.",
        //     postAvatar: "https://image.nhandan.vn/w800/Uploaded/2024/buimsbvibuvwsi/2024_04_16/8-moi-2-8788.jpg.webp",
        //     postCreatorName: "Hoài Anh",
        //     postCreatedAt: "Thứ 6, 26/04/2024 9:32 (GMT+7)"
        // },
        // {
        //     postId: 5,
        //     postTitle: "Dự báo xâm nhập mặn khu vực Nam Bộ từ ngày 22-28/4",
        //     postContent: "Dự báo, từ ngày 11-20/4, xâm nhập mặn ở đồng bằng sông Cửu Long ở mức cao vào đầu tuần, sau đó giảm dần vào cuối tuần. Cảnh báo trong tháng 4, xâm nhập mặn tăng cao ở khu vực Nam Bộ khả năng tập trung từ ngày 22-28/4. Theo nhận định của Trung tâm Dự báo khí tượng thủy văn quốc gia, từ ngày 11-20/4, khu vực miền Tây Nam Bộ tiếp tục phổ biến ít mưa, ngày nắng nóng, có nơi nắng nóng gay gắt. Tuy mưa không nhiều nhưng người dân cần chú ý có thể xuất hiện mưa dông cục bộ vào chiều tối và khả năng kèm theo lốc, sét, gió giật mạnh nguy hiểm. Nhiệt độ cao nhất tại miền Tây Nam Bộ phổ biến từ 34-37 độ C, có nơi cao hơn. Trong thời kỳ này, mực nước trên sông Tiền và sông Hậu dao động theo triều với xu thế xuống dần vào cuối tuần. Mực nước cao nhất tuần tại Tân Châu là 1,40m, tại Châu Đốc 1,55m, ở mức cao hơn trung bình nhiều năm cùng kỳ từ 0,1-0,3m.",
        //     postAvatar: "https://image.nhandan.vn/w800/Uploaded/2024/huounvj/2024_04_10/6983jpg-2438.jpg.webp",
        //     postCreatorName: "Văn Hoàng",
        //     postCreatedAt: "Thứ 5, 25/04/2024 9:32 (GMT+7)"
        // },
    ]);

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

        // newsList.forEach((news) => {
        //     console.log("post id: ", news.postId);
        //     if(news?.postId.toString() === id) {
        //         setNewsContent(news);
        //         console.log("news: ", news);
        //     }
        // })

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
                            {/* Thứ 2, 29/05/2024 9:32 (GMT+7) */}
                        </div>
                        <div className="news__content" dangerouslySetInnerHTML={{__html: newsContent?.postContent}}> 
                            {/* Gần 21.000 xe đạp cải tiến, mỗi chiếc chở 200-300 kg, đã góp phần giải quyết bài toán vận tải quân lương, vũ khí cho chiến dịch Điện Biên Phủ.
                            Ngày 6/12/1953, Bộ Chính trị quyết định mở chiến dịch tổng tiến công vào pháo đài bất khả xâm phạm của quân Pháp ở Điện Biên Phủ. Theo tính toán của Bộ Tổng tham mưu Quân đội nhân dân Việt Nam cùng Tổng cục Cung cấp, để phục vụ hơn 87.000 người ở tuyến đầu (54.000 bộ đội và 33.000 dân công) cần huy động ít nhất 16.000 tấn gạo (chưa kể gạo cho dân công), 100 tấn thịt, 100 tấn rau, 80 tấn muối và khoảng 12 tấn đường...       */}
                        </div>
                        <div className="news__author">
                            { newsContent?.postCreatorName }
                            {/* Tác giả */}
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