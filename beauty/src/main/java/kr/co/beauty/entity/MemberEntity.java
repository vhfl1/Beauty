package kr.co.beauty.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;

@Data
@Entity
@Table(name="member")
public class MemberEntity {
	@Id
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
	
	
	// terms
	@Transient
	private String terms;
	@Transient
	private String privacy;
	@Transient
	private String location;
}
