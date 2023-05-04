package kr.co.beauty.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import kr.co.beauty.vo.MemberVO;
import kr.co.beauty.vo.MyorderVO;

@Mapper
@Repository
public interface MemberDAO {
	public int insertMember(MemberVO vo);
	public MemberVO selectTerms();

	// 아이디 찾기
	public String findId(String arg0, String arg1);
	
	// 비밀번호 찾기
	public String findPw(String arg1);
	
	// 자동로그인
	public int countByNameAndUid(String name, String uid);
	
	// 비밀번호 변경
	public int findPwResult(String arg0, String arg1);
	
	// 비회원 주문 고객정보 조회
	public List<MyorderVO> joinNonOrder(String arg0, String arg1, String arg2);
	
	// 비회원 주문 상품 리스트
//	public List<MyorderVO> selectNonOrder(@Param("orderer") String orderer, @Param("orderHp") String orderHp, @Param("ordNo") String ordNo);
	
	// 김동근
	public MemberVO selectMember(@Param("uid") String uid);
	//내 프로필
	public int updateMember(MemberVO vo);
	public int savePassword(@Param("uid") String uid, @Param("pass") String pass);
	public int deleteMember(@Param("uid") String uid);
	
	
}
