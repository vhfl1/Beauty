package kr.co.beauty.controller;

import java.security.Principal;
import java.util.List;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import kr.co.beauty.service.MainService;
import kr.co.beauty.service.UtilService;
import kr.co.beauty.utils.CookieManager;
import kr.co.beauty.vo.ProductVO;
import lombok.extern.log4j.Log4j2;

/*
 * 작업자 : 박진휘
 * 내용 : 메인페이지
 */
@Log4j2
@Controller
@MapperScan("kr.co.beauty.vo")
public class MainController {
	@Autowired
	private MainService service;
	@Autowired
	private UtilService util;
	@Autowired
	private CookieManager cookie;

	@GetMapping(value = { "/", "index" })
	public String index(Model model, Principal principal, @CookieValue(required = false) String nomember,
			HttpSession session) {
		
		log.info("메인페이지");
		
		// 새상품
		List<ProductVO> vo = service.selectNewItem();
		
		// 대분류상품
		List<ProductVO> outer = service.selectBestItem("100");
		List<ProductVO> top = service.selectBestItem("200");
		List<ProductVO> bottom = service.selectBestItem("300");
		List<ProductVO> dress = service.selectBestItem("400");
		List<ProductVO> etc = service.selectBestItem("500");
		
		model.addAttribute("lists", vo);
		model.addAttribute("outer", outer);
		model.addAttribute("top", top);
		model.addAttribute("bottom", bottom);
		model.addAttribute("dress", dress);
		model.addAttribute("etc", etc);
		
		// 장바구니 카운터
		Object cartCount = session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);
		
		return "index";
	}

	@ResponseBody
	@PostMapping("setCookie")
	public String setCookie(HttpServletResponse resp, @CookieValue(required = false) String nomember) {
		if (nomember == null) {
			return cookie.nomemberCookie(resp);
		} else {
			return "already exist";
		}
	}
}