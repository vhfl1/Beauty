/*
날짜 : 2023/03/06
이름 : 김동근
내용 : Beauty SpringBoot myshop Controller 
*/
package kr.co.beauty.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.annotation.MapperScan;
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
import kr.co.beauty.service.OrderService;
import kr.co.beauty.service.UtilService;
import kr.co.beauty.vo.CartVO;
import kr.co.beauty.vo.MemberVO;
import kr.co.beauty.vo.OrderVO;
import kr.co.beauty.vo.OrdercompleteVO;
import kr.co.beauty.vo.TermsVO;
import kr.co.beauty.vo.WishVO;
import lombok.extern.log4j.Log4j2;

/*
 * 작업자 : 박진휘, 김동근
 * 내용 : 장바구니 > 주문 > 주문완료
 */
@Log4j2
@MapperScan("kr.co.beauty.dao")
@Controller
public class OrderController {
	@Autowired
	private OrderService service;
	@Autowired
	private MyshopService serviceMy;
	@Autowired
	private UtilService util;

	/* 김동근 */
	/* 카트 페이지 */
	@GetMapping("order/cart")
	public String cart(Model model, Principal principal, @CookieValue(required = false) String nomember,
			HttpSession session) {
		MemberVO member = new MemberVO();
		List<CartVO> cartList = new ArrayList<>();
		List<WishVO> wishList = new ArrayList<>();
		// 로그인 체크 & 회원전용 위시리스트
		String uid = null;
		if (principal != null) {
			uid = principal.getName();
			wishList = serviceMy.selectWishlist(uid);
		}
		// 로그인 했거나 비회원쿠키가 있거나
		if (uid != null || nomember != null) { // 회원 + 비회원 장바구니
			cartList = service.selectCartList(uid, nomember);
		}
		model.addAttribute("uid", uid);
		model.addAttribute("cartList", cartList);
		model.addAttribute("wishList", wishList);
		// 장바구니 카운터
		Object cartCount = session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);
		session.setAttribute("type", "guest");
		session.removeAttribute("viewOrder");
		return "order/cart";
	}

	// 카트 - cartBtns(테이블아래버튼) - 비우기
	@ResponseBody
	@PostMapping("order/deleteAllCart")
	public int deleteAllCart(Principal principal, @CookieValue(required = false) String nomember, HttpSession session) {
		if (principal != null) {
			service.deleteAllCart(principal.getName());
		}
		if (nomember != null) {
			service.deleteAllCart(nomember);
		}
		String cartCount = util.header(principal, nomember);
		session.setAttribute("cartCount", cartCount);
		return 1;
	}

	// 카트 - cartBtns(테이블아래버튼) - 선택상품 삭제
	@ResponseBody
	@PostMapping("order/deleteSelectedCart")
	public int deleteSelectedCart(@RequestParam("chkList[]") int[] deleteList, Principal principal,
			@CookieValue(required = false) String nomember, HttpSession session) {
		for (int cartNo : deleteList) {
			service.deleteSelectedCart(cartNo);
		}
		String cartCount = util.header(principal, nomember);
		session.setAttribute("cartCount", cartCount);
		return 1;
	}

	// 카트 - tableBtns(테이블내부) - 관심상품등록
	@ResponseBody
	@PostMapping("order/addWishFromCart")
	public int addWishFromCart(Principal principal, WishVO vo) {
		vo.setUid(principal.getName());
		return serviceMy.addWish(vo);
	}

	// 카트 - tableBtns(테이블내부) - 삭제
	@ResponseBody
	@GetMapping("order/deleteSelectedCart")
	public int deleteSelectedCart(int cartNo, Principal principal, @CookieValue(required = false) String nomember,
			HttpSession session) {
		service.deleteSelectedCart(cartNo);
		String cartCount = util.header(principal, nomember);
		session.setAttribute("cartCount", cartCount);
		return 1;
	}

	// 카트 - 수량 변경
	@ResponseBody
	@PostMapping("order/cartIncrease")
	public int cartIncrease(int cartNo) {
		return service.cartIncrease(cartNo);
	}

	@ResponseBody
	@PostMapping("order/cartDecrease")
	public int cartDecrease(int cartNo) { // 감소시 수량 체크
		return service.cartDecrease(cartNo);
	}

	// 카트 - 위시리스트 - 삭제 fromCart
	@GetMapping("order/deleteSelectedWishFromCart")
	public String deleteSelectedWishFromCart(int wishNo) {
		serviceMy.deleteSelectedWish(wishNo);
		return "redirect:/order/cart";
	}

	// 카트 - 옵션변경 - 옵션 설정창 열기
	@ResponseBody
	@PostMapping("order/openOption")
	public String openOption(@RequestParam("cartNo") int cartNo) { // 선택 가능 색상값 반환
		return service.openOption(cartNo);
	}

	// 카트 - 옵션변경 - 색상 선택시
	@ResponseBody
	@PostMapping("order/selectOption")
	public String selectOption(@RequestParam("cartNo") int cartNo, @RequestParam("color") String color) {
		return service.selectOption(cartNo, color);
	}

	// 카트 - 옵션변경 - 옵션 저장
	@ResponseBody
	@PostMapping("order/saveOption")
	public int saveOption(@RequestBody CartVO vo) {
		return service.saveOption(vo);
	}

	/********************************************************************************************************************/
	/********************************************************************************************************************/
	/* 박진휘 (주문, 주문완료 처리) */
	@GetMapping("order/orderWait")
	public String orderWait(HttpSession session,
			@RequestParam(required = false, value = "cartNo") int[] cartList) {
		
		log.debug("장바구니 > 주문하기");
		
		// 장바구니에서 주문하기로 가면 보안에 걸려서 파라미터가 날라기기 때문에 세션에 잠시 넣어준다.
		session.setAttribute("cartList", cartList);
		
		return "redirect:/order/orderform";
	}
	// 상세보기 > 주문결제 (회원)
	@GetMapping("order/orderform")
	public String order2type1(Model model, HttpSession session, Principal principal,
			@CookieValue(required = false) String nomember) {

		log.debug("회원 주문페이지");
		
		// 상품정보를 담을 리스트 선언
		List<CartVO> list = new ArrayList<>();
		// 상품 총 개수를 위한 count
		int count = 0;
		
		// 상품보기 > 주문 클릭시 viewOrder != null
		@SuppressWarnings("unchecked")
		List<CartVO> viewOrder = (List<CartVO>) session.getAttribute("viewOrder");
		// 장바구니 > 주문 클릭시 cartList != null
		int[] cartList = (int[]) session.getAttribute("cartList");
		
		// 리스트, 개수 추가
		if (cartList != null && cartList.length > 0 && viewOrder == null) {
			for (int cartNo : cartList) {
				CartVO vo = service.selectCart(cartNo);
				count = count + vo.getCount();
				list.add(vo);
			}
		} else {
			for (int i = 0; i < viewOrder.size(); i++) {
				CartVO vo = service.selectProduct(viewOrder.get(i).getProdNo());
				vo.setCartNo(0);
				vo.setCount(viewOrder.get(i).getCount());
				vo.setColor(viewOrder.get(i).getColor());
				vo.setSize(viewOrder.get(i).getSize());
				list.add(vo);
				count = count + vo.getCount();
			}
		}
		session.setAttribute("orderItem", list);
		model.addAttribute("list", list);
		model.addAttribute("count", count);
		
		// 장바구니 카운터
		Object cartCount = session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);
		
		// 로그인한 유저의 정보
		String uid = principal.getName();
		MemberVO vo = service.selectMember(uid);
		model.addAttribute("member", vo);
		
		return "order/orderform";
	}

	// 상세보기 > 주문결제 (비회원)
	@GetMapping("order/non_orderform")
	public String order2type2(String type, Model model, HttpSession session, Principal principal,
			@CookieValue(required = false) String nomember) {
		
		log.info("비회원 주문페이지");
		
		// 비회원 type 확인
		if (type.equals("guest")) {
			// 상품정보를 담을 리스트 선언
			List<CartVO> list = new ArrayList<>();
			// 상품 총 개수를 위한 count
			int count = 0;
			
			// 상품보기 > 주문 클릭시 viewOrder != null
			@SuppressWarnings("unchecked")
			List<CartVO> viewOrder = (List<CartVO>) session.getAttribute("viewOrder");
			// 장바구니 > 주문 클릭시 cartList != null
			int[] cartList = (int[]) session.getAttribute("cartList");
			
			// 리스트, 개수 추가
			if (cartList != null && cartList.length > 0 && viewOrder == null) {
				for (int cartNo : cartList) {
					CartVO vo = service.selectCart(cartNo);
					list.add(vo);
					count += vo.getCount();
				}
			} else {
				for (int i = 0; i < viewOrder.size(); i++) {
					CartVO vo = service.selectProduct(viewOrder.get(i).getProdNo());
					vo.setCartNo(0);
					vo.setCount(viewOrder.get(i).getCount());
					vo.setColor(viewOrder.get(i).getColor());
					vo.setSize(viewOrder.get(i).getSize());
					list.add(vo);
					count += vo.getCount();
				}
			}
			session.setAttribute("orderItem", list);
			model.addAttribute("list", list);
			model.addAttribute("count", count);
			
			// 장바구니 카운터
			Object cartCount = session.getAttribute("cartCount");
			if (cartCount == null) {
				cartCount = util.header(principal, nomember);
				session.setAttribute("cartCount", cartCount);
			}
			model.addAttribute("cartCount", cartCount);
			
			//비회원 약관
			TermsVO terms = service.orderTerms();
			model.addAttribute("terms", terms);
			
			return "order/non-orderform";
		} else {
			// 타입이 없으면 메인페이지로
			return "redirect:/Beauty/index";
		}

	}

	@ResponseBody
	@PostMapping("order/orderform/type1")
	public Map<String, Integer> order2type1(OrdercompleteVO vo, HttpSession session, Principal principal,
			@CookieValue(required = false) String nomember) {
		
		log.info("회원 주문처리");
		
		// 주문페이지에서 가져온 제품정보
		@SuppressWarnings("unchecked")
		List<CartVO> item = (List<CartVO>) session.getAttribute("orderItem");
		
		// 주문완료, 주문테이블 Insert
		service.complete(vo, item);
		
		// 사용한 제품정보 제거
		session.removeAttribute("orderItem");
		
		// JSON 리턴
		Map<String, Integer> result = new HashMap<>();
		result.put("result", vo.getOrdNo());
		
		// 장바구니 카운터 재계산
		String cartCount = util.header(principal, nomember);
		session.setAttribute("cartCount", cartCount);
		
		return result;
	}

	@ResponseBody
	@PostMapping("order/orderform/type2")
	public Map<String, Integer> order2type2(OrdercompleteVO vo, HttpSession session, Principal principal,
			@CookieValue(required = false) String nomember) {
		
		log.info("비회원 주문처리");
		
		// 주문페이지에서 가져온 제품정보
		@SuppressWarnings("unchecked")
		List<CartVO> item = (List<CartVO>) session.getAttribute("orderItem");
		
		// 주문완료, 주문테이블 Insert
		service.complete(vo, item);
		
		// 사용한 제품정보 제거
		session.removeAttribute("orderItem");
		
		// JSON 리턴
		Map<String, Integer> result = new HashMap<>();
		result.put("result", vo.getOrdNo());
		
		// 장바구니 카운터 재계산
		String cartCount = util.header(principal, nomember);
		session.setAttribute("cartCount", cartCount);
		
		return result;
	}

	// 주문완료
	@GetMapping("order/ordercomplete")
	public String ordercomplete2(Model model, int ordNo, Principal principal,
			@CookieValue(required = false) String nomember, HttpSession session) {
		
		log.info("주문완료 페이지");
		
		// 주문완료 검색
		OrdercompleteVO vo = service.selectOrdercomplete(ordNo);
		
		// 주문제품 낱개 검색
		List<OrderVO> orders = service.selectOrder(ordNo);
		model.addAttribute("vo", vo);
		model.addAttribute("orders", orders);
		
		// 장바구니 카운터
		Object cartCount = session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);
		
		return "order/ordercomplete";
	}
}
