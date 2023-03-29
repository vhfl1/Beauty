package kr.co.beauty.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import kr.co.beauty.vo.MemberVO;

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
	
	
	
	// 김동근
	public MemberVO selectMember(@Param("uid") String uid);
	//내 프로필
	public int updateMember(MemberVO vo);
	public int savePassword(@Param("uid") String uid, @Param("pass") String pass);
	public int deleteMember(@Param("uid") String uid);
	
	
}
