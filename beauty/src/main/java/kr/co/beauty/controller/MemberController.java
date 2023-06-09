package kr.co.beauty.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import kr.co.beauty.service.EmailService;
import kr.co.beauty.service.MemberService;
import kr.co.beauty.service.UtilService;
import kr.co.beauty.vo.MemberVO;
import kr.co.beauty.vo.MyorderVO;
import kr.co.beauty.vo.Product1VO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@MapperScan("kr.co.beauty.dao")
@Controller
public class MemberController {

	@Autowired
	private MemberService service;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private EmailService emailService;
	@Autowired
	private UtilService util;

	// 로그인 출력
	@GetMapping("member/login")
	public String login(Model model, Principal principal, @CookieValue(required = false) String nomember, HttpSession session) {
		log.info("로그인 화면 출력");
		// 장바구니 카운터
		String cartCount = (String) session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);
		String type = (String) session.getAttribute("type");
		model.addAttribute("type", type);
		session.removeAttribute("type");
		return "member/login";
	}
	
	// 회원가입
	@GetMapping("member/register")
	public String register(Model model, Principal principal, @CookieValue(required = false) String nomember, HttpSession session) {
		log.info("회원가입 화면 출력");
		MemberVO vo = service.selectTerms();
//		log.info("vo : " + vo);
		model.addAttribute("memberVO", vo);

		// 장바구니 카운터
		String cartCount = (String) session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);

		return "member/register";
	}
	
	// 회원가입
	@PostMapping("member/register")
	public String register(MemberVO vo, HttpServletRequest req) {
		log.info("회원가입" + vo);
		String regip = req.getRemoteAddr();
		vo.setRegip(regip);
		int result = service.insertMember(vo);
		return "redirect:/member/login?seccess=" + result;
	}

	// 아이디 중복체크
	@ResponseBody
	@GetMapping("member/checkUid")
	public Map<String, Integer> checkUid(String uid) {
		int result = service.countMember(uid);
		Map<String, Integer> map = new HashMap<>();
		map.put("result", result);
		return map;
	}

	// 아이디 찾기
	@GetMapping("member/find")
	public String find(int type, Model model, Principal principal, @CookieValue(required = false) String nomember, HttpSession session) {
		log.info("아이디/비밀번호 찾기 페이지 출력");
		// 아이디/비밀번호 찾기 구분
		model.addAttribute("type", type);
		//장바구니 카운터
		String cartCount = (String) session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);
		return "member/find";
	}

	// 아이디 찾기 - 이름, 휴대폰 번호 입력 후 아이디 표시(고객님의 아이디는 xxx입니다)
	@ResponseBody
	@PostMapping("member/find1")
	public Map<String, String> find(Model model, String name, String phone, HttpSession session) {
		log.info("이름(find1) : " + name);
		log.info("휴대폰 번호(find1) : " + phone);
		// 아이디 찾기 정보(이름, 휴대전화)
		String rs = service.findId(name, phone);
		session.setAttribute("rs", rs);
		
		Map<String, String> result = new HashMap<>();
		result.put("result", rs);
		return result;
	}

	// 비밀번호 찾기 - 이메일 인증 후 아이디 표시 (고객님의 아이디는 xxx입니다)
	@ResponseBody
	@PostMapping("member/find2")
	public int findPw(@RequestParam("uid") String uid, HttpSession session) {
		log.info("아이디(find2) : " + uid);
		// System.out.println("name : " + name);
		
		String rs = service.findPw(uid);
		// 아이디 표시 [[{uid}]] (findPwResult get model로 이어짐)
		session.setAttribute("uid", uid);
	  
		return 1;
	}

	// 아이디 찾기 - (고객님의 아이디는 xxx입니다)
	@GetMapping("member/findIdResult")
	public String findIdResult(Model model, Principal principal, @CookieValue(required = false) String nomember, HttpSession session) {
		log.info("아이디 찾기 화면 출력");
		// find1 post에 선언된 session의 rs를 받아옴
		String uid = (String) session.getAttribute("rs");
		model.addAttribute("uid", uid);

		// MemberVO vo = service.selectUid(uid);
		// model.addAttribute("vo", vo);
		// 장바구니 카운터
		String cartCount = (String) session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);
		return "member/findIdResult";
	}

	// 비밀번호 변경 - (고객님의 아이디는 xxx입니다) + 비밀번호 변경
	@GetMapping("member/findPwResult")
	public String findPwResult(Model model, Principal principal, @CookieValue(required = false) String nomember, HttpSession session) {
		log.info("비밀번호 변경 화면 출력");
		String uid = (String) session.getAttribute("uid");
		// 아이디 표시 [[{uid}]] (find2 post 부분에 선언된 session uid를 받아옴)
		model.addAttribute("uid", uid);
		// 장바구니 카운터
		String cartCount = (String) session.getAttribute("cartCount");
		if (cartCount == null) {
			cartCount = util.header(principal, nomember);
			session.setAttribute("cartCount", cartCount);
		}
		model.addAttribute("cartCount", cartCount);
		return "member/findPwResult";
	}
	
	// 비밀번호 변경 - (고객님의 아이디는 xxx입니다) + 비밀번호 변경
	@ResponseBody
	@PostMapping("member/findPwResult")
	public Map<String, Integer> findPwResult(@RequestParam("uid") String uid, @RequestParam("pass") String pass) {
		log.info("비밀번호 변경 완료");
		pass = passwordEncoder.encode(pass);
		System.out.println(uid);
		System.out.println(pass);
		int result = service.findPwResult(uid, pass);
		Map<String, Integer> map = new HashMap<>();
		map.put("result", result);
		return map;
	}

	// 이메일 발송(회원가입, 비밀번호 찾기)
	@ResponseBody
	@PostMapping("member/emailAuth")
	public Map<String, Integer> checkEmail(@RequestParam("email") String email) throws Exception {
		Map<String, Integer> data = new HashMap<>();
		int code = emailService.sendSimpleMessage(email);
		log.info("인증코드(controller) : " + code);
		data.put("status", 1);
		data.put("code", code);
		return data;
	}
	
	// 비회원 주문 고객정보 조회
	/*
	@GetMapping("member/joinNonOrder")
	public String joinNonOrder(Principal principal, Model model, HttpSession session) {
		log.info("비회원 주문조회 화면 출력");
		
		// 아래 Post에 선언된 session을 html로 당겨옴
		String name = (String) session.getAttribute("name");
		String phone = (String) session.getAttribute("phone");
		String orderNumber = (String) session.getAttribute("orderNumber");
//		String orderNumber = (String) session.getAttribute("orderNumber");
//		String orderNumber = (String) session.getAttribute("orderNumber");
//		String orderNumber = (String) session.getAttribute("orderNumber");
		
		
		model.addAttribute("name", name);
		model.addAttribute("phone", phone);
		model.addAttribute("orderNumber", orderNumber);
		
		// 비회원 주문 상품 가져오기
//		nonOrderList = service.selectNonOrder(principal.getName());
//		model.addAttribute("nonOrder", nonOrder);
		
		return "member/joinNonOrder";
	}
	*/
	
	@GetMapping("member/joinNonOrder")
	public String joinNonOrder(Principal principal, Model model, HttpSession session) {
		log.info("비회원 주문조회 화면 출력");
		
		String name = (String) session.getAttribute("name");
		String phone = (String) session.getAttribute("phone");
		String orderNumber = (String) session.getAttribute("orderNumber");
		
		List<MyorderVO> orderList = service.joinNonOrder(name, phone, orderNumber);
		model.addAttribute("orderList", orderList);
		model.addAttribute("name", name);
		model.addAttribute("phone", phone);
		model.addAttribute("orderNumber", orderNumber);

		return "member/joinNonOrder";
	}
	
	
	// 비회원 주문 고객정보 조회
	@ResponseBody
	@PostMapping("member/nonOrder")
	public Map<String, List<MyorderVO>> joinNonOrder(HttpSession session, Model model, String name, String phone, String orderNumber) {
		log.info("이름(joinNonOrder) : " + name);
		log.info("휴대폰 번호(joinNonOrder) : " + phone);
		log.info("비회원주문 번호(joinNonOrder) : " + orderNumber);
//		
		
//		session.setAttribute("rs", rs);
		
		// HttpSession session 선언, name, phone, orderNumber (get으로 넘김)
		session.setAttribute("name", name);
		session.setAttribute("phone", phone);
		session.setAttribute("orderNumber", orderNumber);
		
		// 아이디 찾기 정보(이름, 휴대전화, 주문번호)
		List<MyorderVO> rs = service.joinNonOrder(name, phone, orderNumber);
		Map<String, List<MyorderVO>> result = new HashMap<>();
		result.put("result", rs);
		

		return result;
	}
	
	// 주문번호 찾기
//	findOrderNumber
	
	
	
}
