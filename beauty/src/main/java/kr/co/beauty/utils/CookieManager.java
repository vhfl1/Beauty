/*
날짜 : 2023/03/08
이름 : 김동근
내용 : Beauty SpringBoot 세션관리
*/
package kr.co.beauty.utils;

import java.util.UUID;

import org.springframework.stereotype.Component;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CookieManager {
	
	/* 비회원 아이디 */
	//관리 및 에러방지를 위해 상수로 선언
	public static final String NO_MEMBER_COOKIE = "nomember";
	
	//쿠키 생성
	public String nomemberCookie(HttpServletResponse resp) {
		String cookieId = UUID.randomUUID().toString();
		Cookie cookie = new Cookie(NO_MEMBER_COOKIE, cookieId);
		cookie.setPath("/");
		cookie.setMaxAge(60*60*24*2);
		resp.addCookie(cookie);
		
		return cookieId;
	}
	
}
