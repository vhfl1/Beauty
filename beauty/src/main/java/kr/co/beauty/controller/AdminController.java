package kr.co.beauty.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.beauty.service.AdminService;
import kr.co.beauty.vo.Product1VO;
import kr.co.beauty.vo.ProductOptionVO;
import lombok.extern.log4j.Log4j2;

/*
 * 작업자: 윤사랑
 * 내용: 상품등록,상품목록 보기
 * 
 */
@Log4j2
@MapperScan("kr.co.beauty.dao")
@Controller
public class AdminController {

	@Autowired
	private AdminService service;

	//상품등록 페이지 출력
	@GetMapping("admin/product/register")
	public String register() {
		
		log.info("상품등록 페이지 출력");
		
		return "admin/product/register";
	}

	// 상품등록
	@ResponseBody
	@PostMapping("admin/product/register")
	public String register(Product1VO vo, @RequestParam(value = "colorArr[]") List<String> colorArr,
			@RequestParam(value = "colorNameArr[]") List<String> colorNameArr,
			@RequestParam(value = "sizeArr[]") List<String> sizeArr) {
		
		log.info("상품등록");
		
		// product 테이블 상품 등록
		service.insertProduct(vo);
		// 등록 후 자동 생성된 상품번호 받기
		int param1 = vo.getProdNo();
		// product_option 테이블에 상품 옵션 등록
		log.info("상품등록::추가옵션 등록");
		
		service.insertOption(param1, colorArr, colorNameArr, sizeArr);

		return "";
	}

	
	//상품목록 페이지
	@GetMapping("admin/product/list")
	public String list() {

		log.info("상품목록 페이지 출력");
		
		return "admin/product/list";
	}

	// 상품목록 분류
	@ResponseBody
	@PostMapping("admin/product/list")
	public Map<String, List<Product1VO>> list(@RequestParam(value = "collection[]") List<String> collection) {

		log.info("상품목록::카테고리별 상품목록 보기");
		
		//카테고리별 상품목록 불러오기
		List<Product1VO> products = service.selectProducts(collection);
		Map<String, List<Product1VO>> result = new HashMap<>();

		result.put("result", products);
		return result;
	}

	//페이징 처리를 위한 상품 개수 세기
	@ResponseBody
	@PostMapping("admin/product/listCount")
	public Map<String, Integer> count(@RequestParam(value = "collection[]") List<String> collection) {
		//목록에 출력할 총 상품 개수
		int result = service.selectCountProducts(collection);

		Map<String, Integer> map = new HashMap<>();
		map.put("result", result);

		return map;
	}

	// 삭제버튼을 이용한 상품 삭제
	@GetMapping("admin/product/list/delete")
	@ResponseBody
	public String delete(String prodNo) {
		
		log.info("상품 삭제: "+prodNo);
		
		int result = service.deleteProduct(prodNo);

		return result + "";
	}

	// 체크박스를 이용한 상품 삭제
	@PostMapping("admin/product/list/delete")
	@ResponseBody
	public String delete(@RequestParam(value = "checkBoxArr[]") List<String> checkBoxArr) {

		log.info("상품 삭제: "+checkBoxArr);
		
		int result = 0;

		for (int i = 0; i < checkBoxArr.size(); i++) {
			result = service.deleteProduct(checkBoxArr.get(i));
		}
		return result + "";
	}

	//상품목록에서 상품 검색
	@GetMapping("admin/product/search")
	public String search(Model model, @RequestParam(required=false) String[] arg0, String arg2, String param2, String pg) {
		
		log.info("상품검색::검색유형: "+param2+", 키워드: "+arg2);
		
		//검색결과 목록 페이징 처리
		int currentPage = service.getCurrentPage(pg);
        int arg3 = service.getLimitStart(currentPage);
       
        int total = service.selectCountProductByKeyword(param2, arg2);//검색한 상품 총 개수
        int lastPageNum = service.getLastPageNum(total);
        int pageStartNum = service.getPageStartNum(total, arg3);
        int groups[] = service.getPageGroup(currentPage, lastPageNum);
        
        //검색한 상품 목록 불러오기
        List<Product1VO> products = service.searchProduct(arg0, param2, arg2, arg3);

        model.addAttribute("products",  products);
		model.addAttribute("arg0",  arg0);
		model.addAttribute("param2",  param2);
		model.addAttribute("arg2",  arg2);
		model.addAttribute("groups", groups);
		model.addAttribute("currentPage", currentPage);
        model.addAttribute("lastPageNum", lastPageNum);
        model.addAttribute("pageStartNum", pageStartNum);
		
		return "admin/product/search";
	}
	
	//재고관리 페이지
	@GetMapping("admin/product/stock")
	public String stock(Model model, String pg) {
		
		//상품 목록 페이징 처리
		int currentPage = service.getCurrentPage(pg);
        int arg3 = service.getLimitStart(currentPage);
       
        int total = service.selectCountProducts(null);
        int lastPageNum = service.getLastPageNum(total);
        int pageStartNum = service.getPageStartNum(total, arg3);
        int groups[] = service.getPageGroup(currentPage, lastPageNum);
        
        //상품 목록 불러오기
        List<Product1VO> products = service.selectProduct(arg3);

		model.addAttribute("products", products);
		model.addAttribute("groups", groups);
		model.addAttribute("currentPage", currentPage);
        model.addAttribute("lastPageNum", lastPageNum);
        model.addAttribute("pageStartNum", pageStartNum);
        
		return "admin/product/stock";
	}
	
	//재고관리 페이지에서 재고 상세보기 모달 창
	@PostMapping("admin/product/stock")
	@ResponseBody
	public Map<String, Object> stockDetail(Model model, String prodNo) {
		List<Integer> solds= new ArrayList<>();
		int sold=0;
		
		//해당 상품 번호의 사이즈
		List<String> sizes = service.selectProductSize(prodNo);
		//해당 상품 번호의 색상
		List<String> colors = service.selectProductColorName(prodNo);
		//해당 상품 번호의 재고
		for (int i = 0; i < sizes.size(); i++) {
			for (int j = 0; j < colors.size(); j++) {
				sold = service.selectProductSold(prodNo,sizes.get(i),colors.get(j));
				solds.add(sold);
			}
			
		}
		Map<String, Object> map = new HashMap<>();
		map.put("result1", sizes);
		map.put("result2", colors);
		map.put("result3", solds);
		
		return map;
	}
	
	//재고등록 페이지에서 재고 등록하기
	@ResponseBody
	@PostMapping("admin/product/stockRegister")
	public String stockRegister(String arg1,
							@RequestParam(value = "arg2[]") List<String> arg2, 
							@RequestParam(value = "arg3[]") List<String> arg3, 
							@RequestParam(value = "arg0[]") List<String> arg0) {
		
		//색상,사이즈별로 재고 등록하기
		for(int i=0; i<arg2.size(); i++) {
			service.updateStock(arg0.get(i), arg1, arg2.get(i), arg3.get(i));
		}
		//총 재고 등록하기
		service.UpdateTotalStock(arg1);
	    
		return "admin/product/stock";
	}
}