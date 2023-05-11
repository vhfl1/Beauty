/*
 * 날짜 : 2023-03-07
 * 이름 : 강중현
 * 내용 : memberVO
 */
package kr.co.beauty.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MemberVO {
	private String uid;
	private String pass1;
	private String pass2;
	private String pass;
	private String name;
	private String level;
	private int point;
	private String phone;
	private String zip;
	private String addr1;
	private String addr2;
	private String regip;
	private String rdate;
	private String height;
	private String weight;
	
	private String phone1;
	private String phone2;
	private String phone3;
	private String email1;
	private String email2;
	private int boughtPrice;
	
	// terms
	private String terms;
	private String privacy;
	private String location;
	
	
}
