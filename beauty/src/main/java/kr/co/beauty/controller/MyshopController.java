/*
날짜 : 2023/03/06
이름 : 김동근
내용 : Beauty SpringBoot myshop Controller 
*/
package kr.co.beauty.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpSession;
import kr.co.beauty.service.MyshopService;
import kr.co.beauty.service.UtilService;
import kr.co.beauty.vo.MemberVO;
import kr.co.beauty.vo.MyorderVO;
import kr.co.beauty.vo.PointVO;
import kr.co.beauty.vo.WishVO;

@Controller
public class MyshopController {

	@Autowired
	private MyshopService service;
	@Autowired
	private UtilService util;

	/* 인덱스 */
	@GetMapping(value = { "myshop/", "myshop/index" })
	public String myhome(Principal principal, Model model, HttpSession session, @CookieValue(required = false)String nomember) {
		// 유저 정보 받기
		if (principal != null) {
			MemberVO member = service.selectMember(principal.getName());
			model.addAttribute("member", member);
		}
		//카테고리
		model.addAttribute("option", "myhome");
		// 장바구니 카운터
		Object cartCount = session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);
		return "myshop/myhome";
	}

	/* 주문내역 */
	@GetMapping("myshop/myorder")
	public String myorder(Principal principal, Model model, HttpSession session, @CookieValue(required = false)String nomember) {
		List<MyorderVO> orderList = new ArrayList<>();
		if (principal != null) {
			// 유저 정보 받기
			MemberVO member = service.selectMember(principal.getName());
			model.addAttribute("member", member);
			// 주문 내역 가져오기
			// orderList = service.selectOrderListSearchDate(principal.getName(), start,
			// end, 0);
		}
		model.addAttribute("orderList", orderList);
		// 카테고리
		model.addAttribute("option", "myorder");
		// 장바구니 카운터
		Object cartCount = session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);
		return "myshop/myorder";
	}

	@ResponseBody
	@PostMapping("myshop/myorderSearchDate")
	public List<MyorderVO> myorderSearchDate(Principal principal, @RequestParam("pg") int pg,
			@RequestParam("end") String end, @RequestParam("start") String start) {
		List<MyorderVO> orderList = new ArrayList<>();
		if (principal != null) {
			// 내 주문내역 가져오기
			int limitstart = (pg - 1) * 10;
			orderList = service.selectOrderListSearchDate(principal.getName(), start, end, limitstart);
		}
		return orderList;
	}

	@ResponseBody
	@PostMapping("myshop/countOrderList")
	public int countOrderList(Principal principal, @RequestParam("end") String end,
			@RequestParam("start") String start) {
		return service.countOrderList(principal.getName(), start, end);
	}

	// 배송조회
	@GetMapping("myshop/track")
	public String track() {
		return "myshop/track";
	}
	
	// 구매 확정
	@ResponseBody
	@PostMapping("myshop/orderConfirm")
	public int orderConfirm(@RequestParam("ordNo") int ordNo) {
		return service.orderConfirm(ordNo);
	}
	
	/*
	// 리뷰 작성
	@GetMapping("myshop/track")
	public String track() {
		return "myshop/track";
	}
	*/
	
	
	/* 쿠폰 */
	@GetMapping("myshop/coupon")
	public String coupon(Principal principal, Model model, HttpSession session, @CookieValue(required = false)String nomember) {
		// 유저 정보 받기
		if (principal != null) {
			MemberVO member = service.selectMember(principal.getName());
			model.addAttribute("member", member);
		}
		// 내 쿠폰목록 가져오기

		// 카테고리
		model.addAttribute("option", "coupon");
		// 장바구니 카운터
		Object cartCount = session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);
		return "myshop/coupon";
	}

	/* 적립금 */
	@GetMapping("myshop/point")
	public String point(Principal principal, Model model, HttpSession session, @CookieValue(required = false)String nomember) {
		// 유저 정보 받기
		if (principal != null) {
			MemberVO member = service.selectMember(principal.getName());
			model.addAttribute("member", member);
		}
		// 내 적립내역 가져오기

		// 카테고리
		model.addAttribute("option", "point");
		// 장바구니 카운터
		Object cartCount = session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);
		return "myshop/point";
	}
	
	@ResponseBody
	@PostMapping("myshop/pointSearchDate")
	public List<PointVO> pointSearchDate(Principal principal, @RequestParam("pg") int pg,
			@RequestParam("end") String end, @RequestParam("start") String start, @RequestParam("type") String type) {
		List<PointVO> orderList = new ArrayList<>();
		if (principal != null) {
			// 내 주문내역 가져오기
			int limitstart = (pg - 1) * 10;
			if(type.equals("적립")) {
				orderList = service.selectSavePointListSearchDate(principal.getName(), start, end, limitstart);
			}else {
				orderList = service.selectUsedPointListSearchDate(principal.getName(), start, end, limitstart);
			}
		}
		
		return orderList;
	}

	@ResponseBody
	@PostMapping("myshop/countPointList")
	public int countPointList(Principal principal, @RequestParam("end") String end,
			@RequestParam("start") String start, @RequestParam("type") String type) {
		if(type.equals("적립")) {
			return service.countSavePointList(principal.getName(), start, end);
		}else {
			return service.countUsedPointList(principal.getName(), start, end);
		}
	}

	/* 1:1문의 */
	@GetMapping("myshop/myqna")
	public String myqna(Principal principal, Model model, HttpSession session, @CookieValue(required = false)String nomember) {
		// 유저 정보 받기
		if (principal != null) {
			MemberVO member = service.selectMember(principal.getName());
			model.addAttribute("member", member);
		}
		// 내 문의내역 가져오기

		// 카테고리
		model.addAttribute("option", "myqna");
		// 장바구니 카운터
		Object cartCount = session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);
		return "myshop/myqna";
	}

	/* 위시 리스트 */
	@GetMapping("myshop/wishlist")
	public String wishlist(Principal principal, Model model, HttpSession session, @CookieValue(required = false)String nomember) {
		if (principal != null) {
			// 유저 정보 받기
			MemberVO member = service.selectMember(principal.getName());
			model.addAttribute("member", member);
			// 위시리스트 가져오기
			List<WishVO> wishList = service.selectWishlist(principal.getName());
			model.addAttribute("wishList", wishList);
		}
		// 카테고리
		model.addAttribute("option", "wishlist");
		// 장바구니 카운터
		Object cartCount = session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);
		return "myshop/wishlist";
	}

	// 위시리스트 전체삭제
	@ResponseBody
	@PostMapping("myshop/deleteAllWish")
	public int deleteAllWish(Principal principal) {
		service.deleteAllWish(principal.getName());
		return 1;
	}

	// 위시리스트 선택삭제(1개씩만 가능)
	@GetMapping("myshop/deleteSelectedWish")
	public String deleteSelectedWish(int wishNo) {
		service.deleteSelectedWish(wishNo);
		return "redirect:/myshop/wishlist";
	}

	/* 나의 프로필 */
	@GetMapping("myshop/profile")
	public String profile(Principal principal, Model model, HttpSession session, @CookieValue(required = false)String nomember) {
		// 유저 정보 받기
		if (principal != null) {
			MemberVO member = service.selectMember(principal.getName());
			model.addAttribute("member", member);
		}
		// 카테고리
		model.addAttribute("option", "profile");
		// 장바구니 카운터
		Object cartCount = session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);
		return "myshop/profile";
	}

	@ResponseBody
	@PostMapping("myshop/checkPW")
	public int checkPW(Principal principal, @RequestParam("pass") String pass) {
		return service.checkPW(principal.getName(), pass);
	}

	@ResponseBody
	@PostMapping("myshop/savePassword")
	public int savePassword(Principal principal, @RequestParam("pass") String pass) {
		return service.savePassword(principal.getName(), pass);
	}

	@ResponseBody
	@PostMapping("myshop/updateMember")
	public int updateMember(Principal principal, @RequestBody MemberVO vo) {
		vo.setUid(principal.getName());
		System.out.println("hi");
		return service.updateMember(vo);
	}

	@ResponseBody
	@PostMapping("myshop/deleteMember")
	public int deleteMember(Principal principal) {
		// return service.deleteMember(principal.getName());
		return 1;
	}

}
