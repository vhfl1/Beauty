package kr.co.beauty.vo;

import groovy.transform.ToString;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductOptionVO {
	private int prodNo;
	private String color;
	private String colorName;
	private String size;
	private int sold;
}
