package kr.co.beauty.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import kr.co.beauty.dao.MemberDAO;
import kr.co.beauty.repository.MemberRepo;
import kr.co.beauty.vo.MemberVO;
import kr.co.beauty.vo.MyorderVO;

@Service
public class MemberService {

	@Autowired
	private MemberDAO dao;

	@Autowired
	private MemberRepo repo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	// terms
	public MemberVO selectTerms() {
		return dao.selectTerms();
	}

	// 회원가입
	public int insertMember(MemberVO vo) {
		vo.setPass(passwordEncoder.encode(vo.getPass2()));
		int result = dao.insertMember(vo);
		return result;
	}

	// JPA
	public int countMember(String uid) {
		return repo.countByUid(uid);
	}

	// 아이디 찾기
	public String findId(String name, String phone) {
		return dao.findId(name, phone);
	}

	// 비밀번호 찾기
	public String findPw(String uid) {
		return dao.findPw(uid);
	}

	public int findPwResult(String uid, String pass) {
		return dao.findPwResult(uid, pass);
	}

	// 자동로그인
	public int countByNameAndUid(String name, String uid) {
		return repo.countByNameAndUid(name, uid);
	}
	
	// 비회원 주문 고객정보 조회
	public List<MyorderVO> joinNonOrder(String name, String phone, String orderNumber) {
		return dao.joinNonOrder(name, phone, orderNumber);
	}
	
	// 비회원 주문 상품 리스트
//	public List<MyorderVO> selectNonOrder(String orderer, String orderHp, String ordNo) {
//		return dao.selectNonOrder(orderer, orderHp, ordNo);
//	}
	
}
