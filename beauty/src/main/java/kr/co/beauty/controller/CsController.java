package kr.co.beauty.controller;

import java.security.Principal;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpSession;
import kr.co.beauty.service.UtilService;

@Controller
@MapperScan("kr.co.beauty.dao")
@RequestMapping("/board")
public class CsController {

	@Autowired
	private UtilService util;

	@GetMapping("notice")
	public String notice(Model model, Principal principal, @CookieValue(required = false) String nomember,
			HttpSession session) {
		// 장바구니 카운터
		String cartCount = (String) session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);
		return "community/notice";
	}

	// 공지사항 글보기
	@GetMapping("community/board/notice_view")
	public String noticeView() {
		return "community/board/notice_view";
	}

	@GetMapping("qna")
	public String qna() {
		return "community/qna";
	}

	// qna 글보기
	@GetMapping("community/board/qna_view")
	public String qnaView() {
		return "community/board/qna_view";
	}

	// qna 글쓰기
	@GetMapping("community/board/qna_write")
	public String qnaWrite() {
		return "community/board/qna_write";
	}

	@GetMapping("review")
	public String review() {
		return "community/review";
	}

	// 리뷰 팝업
	@GetMapping("community/board/re_popup")
	public String reviewPopup() {
		return "community/board/re_popup";
	}

	@GetMapping("event")
	public String event() {
		return "community/event";
	}

	// 이벤트 글보기
	@GetMapping("community/board/event_view")
	public String eventView() {
		return "community/board/event_view";
	}

}
