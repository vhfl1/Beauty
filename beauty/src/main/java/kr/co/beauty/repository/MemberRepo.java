package kr.co.beauty.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import kr.co.beauty.entity.MemberEntity;

public interface MemberRepo extends JpaRepository<MemberEntity, String> {
	
	// 아이디 중복체크
	public int countByUid(String uid);
	
	// 자동로그인
	public int countByNameAndUid(String name, String uid);
}
