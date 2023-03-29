package kr.co.beauty.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import kr.co.beauty.dao.MemberDAO;
import kr.co.beauty.dao.OrderDAO;
import kr.co.beauty.vo.CartVO;
import kr.co.beauty.vo.MemberVO;
import kr.co.beauty.vo.OrderVO;
import kr.co.beauty.vo.OrdercompleteVO;
import kr.co.beauty.vo.TermsVO;

@Service
public class OrderService {

	@Autowired
	private MemberDAO daoMem;
	@Autowired
	private OrderDAO daoOrd;

	/* 김동근 */
	// public
	public MemberVO selectMember(String uid) {
		MemberVO vo = daoMem.selectMember(uid);
		String phone = vo.getPhone();
		String[] ph = phone.split("-");
		vo.setPhone1(ph[0]);
		vo.setPhone2(ph[1]);
		vo.setPhone3(ph[2]);

		String email = vo.getUid();
		String[] em = email.split("@");
		vo.setEmail1(em[0]);
		vo.setEmail2(em[1]);

		return vo;
	}

	// cart
	public List<CartVO> selectCartList(String uid, String nomember) {
		return daoOrd.selectCartList(uid, nomember);
	}

	public void deleteSelectedCart(int cartNo) {
		daoOrd.deleteSelectedCart(cartNo);
	}

	public void deleteAllCart(String uid) {
		daoOrd.deleteAllCart(uid);
	}

	public int cartIncrease(int cartNo) {
		return daoOrd.cartIncrease(cartNo);
	}

	public int cartDecrease(int cartNo) {
		if (daoOrd.checkCountForUpdate(cartNo) < 2) {
			return 0;
		} else {
			return daoOrd.cartDecrease(cartNo);
		}
	}

	// cart - modal
	public String openOption(int cartNo) {
		return daoOrd.openOption(cartNo);
	}

	public String selectOption(int prodNo, String color) {
		return daoOrd.selectOption(prodNo, color);
	}

	public int saveOption(CartVO vo) {
		return daoOrd.saveOption(vo);
	}
	
	/********************************************************************************************************************/
	/********************************************************************************************************************/
	/* 박진휘 (주문, 주문완료 처리) */
	
	// 주문완료 검색
	public OrdercompleteVO selectOrdercomplete(int ordNo) {
		return daoOrd.selectOrdercomplete(ordNo);
	}

	// 주문제품 낱개 검색
	public List<OrderVO> selectOrder(int ordNo) {
		return daoOrd.selectOrder(ordNo);
	}

	// 상세보기 > 주문하기 :: 제품 검색
	public CartVO selectProduct(int prodNo) {
		return daoOrd.selectProdut(prodNo);
	}
	// 장바구니 > 주문하기 :: 장바구니 검색
	public CartVO selectCart(int cartNo) {
		return daoOrd.selectCart(cartNo);
	}

	// 비회원 구매약관
	public TermsVO orderTerms() {
		return daoOrd.orderTerms();
	}

	// 트랜잭션
	@Transactional
	public void complete(OrdercompleteVO vo, List<CartVO> item) {
		// 주문완료 Insert
		daoOrd.completeInsert(vo);

		// 유저 포인트 차감,적립
		daoOrd.updateMemberPoint(vo);

		// 주문 Insert & 장바구니 Delete
		for (int i = 0; i < item.size(); i++) {
			insertOrder(vo.getOrdNo(), item.get(i));
			deleteCart(item.get(i).getCartNo());
		}
	}

	// 주문완료전 주문 Insert
	public void insertOrder(int ordNo, CartVO vo) {
		OrderVO result = new OrderVO();
		result.setOrdNo(ordNo);
		result.setProdNo(vo.getProdNo());
		result.setCount(vo.getCount());
		result.setPrice(vo.getPrice());
		result.setDiscount(vo.getDiscount());
		result.setDisPrice(vo.getDisPrice());
		result.setPoint(vo.getPoint());
		result.setColor(vo.getColor());
		result.setSize(vo.getSize());
		result.setTotal(vo.getTotalPrice());
		daoOrd.insertOrder(result);
	}

	// 주문완료전 장바구니 Delete
	public void deleteCart(int cartNo) {
		daoOrd.deleteCart(cartNo);
	}

	// 주문완료전 주문완료 Insert
	public void completeInsert(OrdercompleteVO vo) {
		daoOrd.completeInsert(vo);
	}

}
