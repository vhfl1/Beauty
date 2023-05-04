package kr.co.beauty.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import kr.co.beauty.dao.MemberDAO;
import kr.co.beauty.dao.MyshopDAO;
import kr.co.beauty.vo.MemberVO;
import kr.co.beauty.vo.MyorderVO;
import kr.co.beauty.vo.PointVO;
import kr.co.beauty.vo.WishVO;

@Service
public class MyshopService {

	// JPA
	@Autowired
	private MemberDAO daoMem;
	@Autowired
	private MyshopDAO daoMy;

	// public
	public MemberVO selectMember(String uid) {
		return daoMem.selectMember(uid);
	}

	// myorder
	public List<MyorderVO> selectOrderList(String uid) {
		return daoMy.selectOrderList(uid);
	}

	public List<MyorderVO> selectOrderListSearchDate(String uid, String start, String end, int pg) {
		return daoMy.selectOrderListSearchDate(uid, start, end, pg);
	}

	public int countOrderList(String uid, String start, String end) {
		return daoMy.countOrderList(uid, start, end);
	}
	
	public int orderConfirm (int ordNo) {
		return daoMy.orderConfirm(ordNo);
	}

	// point
	public List<PointVO> selectSavePointListSearchDate (String uid, String start, String end, int pg) {
		return daoMy.selectSavePointListSearchDate(uid, start, end, pg);
	}
	public List<PointVO> selectUsedPointListSearchDate (String uid, String start, String end, int pg) {
		return daoMy.selectUsedPointListSearchDate(uid, start, end, pg);
	}
	public int countSavePointList (String uid, String start, String end) {
		return daoMy.countSavePointList(uid, start, end);
	}
	public int countUsedPointList (String uid, String start, String end) {
		return daoMy.countUsedPointList(uid, start, end);
	}
	
	
	// wishlist
	public int addWish(WishVO vo) {
		// 중복체크
		if (daoMy.checkWish(vo) > 0) {
			return 0;
		} else {
			daoMy.addWish(vo);
			return 1;
		}
	}

	public List<WishVO> selectWishlist(String uid) {
		return daoMy.selectWishlist(uid);
	}

	public void deleteSelectedWish(int wishNo) {
		daoMy.deleteSelectedWish(wishNo);
	}

	public void deleteAllWish(String uid) {
		daoMy.deleteAllWish(uid);
	}

	// profile
	public int checkPW(String uid, String pass) {
		MemberVO vo = daoMem.selectMember(uid);
		if (new BCryptPasswordEncoder().matches(pass, vo.getPass())) {
			return 1;
		} else {
			return 0;
		}
	}

	public int savePassword(String uid, String pass) {
		return daoMem.savePassword(uid, new BCryptPasswordEncoder().encode(pass));
	}

	public int updateMember(MemberVO vo) {
		return daoMem.updateMember(vo);
	}

	public int deleteMember(String uid) {
		return daoMem.deleteMember(uid);
	}

}
