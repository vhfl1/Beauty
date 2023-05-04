package kr.co.beauty.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReplyVO {
	
	private int no;
	private int prodNo;
	private String name;
	private String content;
	private int rating;
	private int height;
	private int weight;
	private String color;
	private String size;
	private String photo;
	private String rdate;
	
	private String maskName;
	public String getMaskName() {
		int len = name.length();
		maskName = name.substring(0,len-1);
		return maskName + "*";
	}
}
